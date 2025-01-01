"use client";

import React, { useEffect, useState } from "react";
import {
  Title,
  TextInput,
  Button,
  Group,
  Container,
  Anchor,
  Breadcrumbs,
  Text,
  NativeSelect,
  LoadingOverlay,
  Alert,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { inspectionResults, inspectionTypes } from "@/data/lists";
import { Role } from "@/types/auth";

const Page = () => {
  const router = useRouter();
  const [users, setUsers] = useState<{ label: string; value: string }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      internshipId: "",
      date: "",
      result: "",
      kind: "",
      note: "",
      inspectionUserId: "",
    },
    validate: {
      internshipId: (value) =>
        value.trim() !== "" ? null : "ID praxe je povinné",
      date: (value) =>
        /^\d{4}-\d{2}-\d{2}$/.test(value)
          ? null
          : "Datum je povinné a musí být ve formátu YYYY-MM-DD",
      result: (value) =>
        value.trim() !== "" ? null : "Výsledek kontroly je povinný",
      kind: (value) =>
        value.trim() !== "" ? null : "Druh kontroly je povinný",
      note: (value) => (value.trim() !== "" ? null : "Poznámka je povinná"),
      inspectionUserId: (value) =>
        value.trim() !== "" ? null : "Kontrolér je povinný",
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Zadejte poznámku k této kontrole...",
      }),
    ],
    content: "",
    onUpdate({ editor }) {
      form.setFieldValue("note", editor.getHTML());
    },
  });

  useEffect(() => {
    setLoadingUsers(true);
    fetch(`/api/users?role=${Role.MANAGER}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nepodařilo se načíst seznam uživatelů.");
        }
        return response.json();
      })
      .then((data) => {
        const formattedUsers = data.data.map((user: any) => ({
          label: `${user.surname}, ${user.givenName} (${user.email})`,
          value: user.id,
        }));
        setUsers([
          { label: "- Vyberte kontroléra -", value: "" },
          ...formattedUsers,
        ]);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoadingUsers(false));
  }, []);

  if (error) {
    return <Alert color="red">{error}</Alert>;
  }

  if (loadingUsers) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Anchor component={Link} href="/dashboard/inspections">
          Kontroly
        </Anchor>
        <Text>Nová kontrola</Text>
      </Breadcrumbs>
      <Container>
        <Title order={2}>Nová kontrola</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            fetch("/api/inspections", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                notifications.show({
                  title: "Povedlo se!",
                  message: "Kontrola byla vytvořena.",
                  color: "lime",
                });
                router.push("/dashboard/inspections", { scroll: false });
              })
              .catch(() => {
                notifications.show({
                  title: "Chyba!",
                  message: "Kontrolu se nepodařilo vytvořit.",
                  color: "red",
                });
              });
          })}
        >
          <TextInput
            withAsterisk
            label="ID praxe"
            placeholder="Zadejte ID praxe"
            {...form.getInputProps("internshipId")}
          />
          <TextInput
            withAsterisk
            label="Datum"
            placeholder="YYYY-MM-DD"
            {...form.getInputProps("date")}
          />
          <NativeSelect
            withAsterisk
            label="Výsledek kontroly"
            data={[{ value: "", label: "- Vyberte -" }, ...inspectionResults]}
            {...form.getInputProps("result")}
          />
          <NativeSelect
            withAsterisk
            label="Druh kontroly"
            data={[{ value: "", label: "- Vyberte -" }, ...inspectionTypes]}
            {...form.getInputProps("kind")}
          />
          <NativeSelect
            withAsterisk
            label="Kontrolér"
            data={users}
            {...form.getInputProps("inspectionUserId")}
          />
          <Text>Poznámka</Text>
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content />
          </RichTextEditor>
          <Group justify="flex-start" mt="md">
            <Button type="submit">Vytvořit</Button>
            <Button
              component={Link}
              href="/dashboard/inspections"
              variant="default"
            >
              Storno
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
};

export default Page;
