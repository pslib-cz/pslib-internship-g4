"use client";

import React, { useEffect, useState } from "react";
import { Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  TextInput,
  Button,
  Group,
  Container,
  Anchor,
  Breadcrumbs,
  Text,
  Checkbox,
  NumberInput,
  NativeSelect,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RichTextEditor, Link as TipLink } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Location } from "@prisma/client";

const Page = () => {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    fetch("/api/locations?orderBy=municipality")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setLocations(
          data.data.map((location: Location) => ({
            label: `${location.country}, ${location.municipality ?? "?"}, ${location.street ?? ""} ${location.descNo ?? ""} ${location.descNo && location.orientNo ? "/" : ""} ${location.orientNo ?? ""}`,
            value: location.id,
          })),
        );
      })
      .catch((error) => {
        notifications.show({
          title: "Chyba!",
          message: "Nepodařilo se načíst lokace.",
          color: "red",
        });
      });
  }, []);
  const form = useForm({
    initialValues: {
      name: "",
      companyIdentificationNumber: undefined,
      active: true,
      description: "",
      website: undefined,
      locationId: undefined,
    },
    validate: {
      name: (value) => (value.trim() !== "" ? null : "Název je povinný"),
    },
  });
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Jedna z největších megakorporací světa.",
      }),
      TipLink,
    ],
    content: form.values.description,
    onUpdate({ editor }) {
      form.setValues({ description: editor.getHTML() });
    },
  });

  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Anchor component={Link} href="/dashboard/companies">
          Firmy
        </Anchor>
        <Text>Nová</Text>
      </Breadcrumbs>
      <Container>
        <Title order={2}>Nová firma</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            if (values.website === "") values.website = undefined;
            fetch("/api/companies", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Při komunikaci se serverem došlo k chybě.");
                }
                notifications.show({
                  title: "Povedlo se!",
                  message: "Firma byla vytvořena.",
                  color: "lime",
                });
                router.push("/dashboard/companies", { scroll: false });
              })
              .catch((error) => {
                notifications.show({
                  title: "Chyba!",
                  message: "Firmu se nepodařilo vytvořit.",
                  color: "red",
                });
              });
          })}
        >
          <TextInput
            withAsterisk
            label="Název"
            placeholder="Arasaka"
            {...form.getInputProps("name")}
          />
          <NumberInput
            label="IČO"
            placeholder="0000000"
            {...form.getInputProps("companyIdentificationNumber")}
          />
          <Checkbox
            my="sm"
            label="Aktivní"
            {...form.getInputProps("active", { type: "checkbox" })}
          />
          <Text>Popis</Text>
          <RichTextEditor
            editor={editor}
            {...form.getInputProps("description")}
          >
            <RichTextEditor.Toolbar>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.Link />
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content />
          </RichTextEditor>
          <TextInput
            label="Webová stránka"
            placeholder="https://arasaka.cz"
            {...form.getInputProps("website")}
          />
          <NativeSelect
            label="Adresa sídla firmy"
            description={`Pokud se zde adresa nenachází, musíte ji nejprve vytvořit v sekci Místa`}
            data={[{ label: "--", value: "" }, ...locations]}
            {...form.getInputProps("locationId")}
          />
          <Group justify="flex-start" mt="md">
            <Button type="submit">Vytvořit</Button>
            <Button
              component={Link}
              href="/dashboard/companies"
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
