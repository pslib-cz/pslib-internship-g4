"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TextInput,
  Button,
  Group,
  Container,
  Anchor,
  Breadcrumbs,
  Text,
  Title,
  Alert,
  NativeSelect,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { inspectionResults, inspectionTypes } from "@/data/lists";
import { Role } from "@/types/auth";

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<{ label: string; value: string }[]>([]);

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
      form.setValues({ note: editor.getHTML() });
    },
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/inspections/${id}`).then((res) => res.json()),
      fetch(`/api/users?role=${Role.MANAGER}`).then((res) => res.json()),
    ])
      .then(([inspectionData, usersData]) => {
        form.setValues({
          internshipId: inspectionData.internship.id,
          date: inspectionData.date.split("T")[0],
          result: String(inspectionData.result),
          kind: String(inspectionData.kind),
          note: inspectionData.note,
          inspectionUserId: inspectionData.inspectionUser.id,
        });
        setUsers([
          { label: "- Vyberte kontroléra -", value: "" },
          ...usersData.data.map((user: any) => ({
            label: `${user.surname}, ${user.givenName} (${user.email})`,
            value: user.id,
          })),
        ]);
        editor?.chain().setContent(inspectionData.note).run();
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [id, editor]);

  if (error) {
    return (
      <Alert color="red" title="Chyba při načítání kontroly">
        {error}
      </Alert>
    );
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
        <Text>Editace</Text>
      </Breadcrumbs>
      <Container>
        <Title order={2}>Editace kontroly</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            const payload = {
                ...values,
                date: `${values.date}T00:00:00.000Z`, // Přidání časové složky
            };
            fetch(`/api/inspections/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Nepodařilo se uložit kontrolu.");
                }
                notifications.show({
                  title: "Povedlo se!",
                  message: "Kontrola byla úspěšně upravena.",
                  color: "lime",
                });
                router.push("/dashboard/inspections", { scroll: false });
              })
              .catch(() => {
                notifications.show({
                  title: "Chyba!",
                  message: "Kontrolu se nepodařilo uložit.",
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
            disabled
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
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content />
          </RichTextEditor>
          <Group justify="flex-start" mt="md">
            <Button type="submit">Uložit</Button>
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