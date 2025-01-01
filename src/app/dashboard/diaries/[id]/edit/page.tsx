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
} from "@mantine/core";
import { RichTextEditor, Link as TipLink } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      internshipId: "",
      date: "",
      text: "",
    },
    validate: {
      internshipId: (value) =>
        value.trim() !== "" ? null : "ID praxe je povinné",
      date: (value) =>
        /^\d{4}-\d{2}-\d{2}$/.test(value)
          ? null
          : "Datum je povinné a musí být ve formátu YYYY-MM-DD",
      text: (value) =>
        value.trim() !== "" ? null : "Text deníkového záznamu je povinný",
    },
  });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/diaries/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nepodařilo se načíst záznam deníku.");
        }
        return response.json();
      })
      .then((data) => {
        form.setValues({
          internshipId: data.internshipId.toString(),
          date: data.date.split("T")[0], // Extrahuje pouze datum
          text: data.text,
        });
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Popis záznamu zde...",
      }),
      TipLink,
    ],
    content: "",
    onUpdate({ editor }) {
      form.setValues({ text: editor.getHTML() });
    },
  });

  useEffect(() => {
    editor?.chain().setContent(form.values.text).run();
  }, [editor, form.values.text]);

  if (error) {
    return (
      <Alert color="red" title="Chyba při načítání záznamu deníku">
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
        <Anchor component={Link} href="/dashboard/diaries">
          Deníky
        </Anchor>
        <Text>Editace</Text>
      </Breadcrumbs>
      <Container>
        <Title order={2}>Editace deníkového záznamu</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            fetch(`/api/diaries/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Nepodařilo se uložit záznam deníku.");
                }
                notifications.show({
                  title: "Povedlo se!",
                  message: "Záznam deníku byl úspěšně upraven.",
                  color: "lime",
                });
                router.push("/dashboard/diaries", { scroll: false });
              })
              .catch((error) => {
                notifications.show({
                  title: "Chyba!",
                  message: "Záznam deníku se nepodařilo uložit.",
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
          <Text>Popis záznamu</Text>
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
            <Button component={Link} href="/dashboard/diaries" variant="default">
              Storno
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
};

export default Page;