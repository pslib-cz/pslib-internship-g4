"use client";

import React from "react";
import { Title, TextInput, Button, Group, Container, Anchor, Breadcrumbs, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

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
      text: (value) => (value.trim() !== "" ? null : "Text záznamu je povinný"),
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Napište text záznamu...",
      }),
    ],
    content: "",
    onUpdate({ editor }) {
      form.setFieldValue("text", editor.getHTML());
    },
  });

  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Anchor component={Link} href="/dashboard/diaries">
          Deníky
        </Anchor>
        <Text>Nový záznam</Text>
      </Breadcrumbs>
      <Container>
        <Title order={2}>Nový deníkový záznam</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            fetch("/api/diaries", {
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
                  message: "Deníkový záznam byl vytvořen.",
                  color: "lime",
                });
                router.push("/dashboard/diaries", { scroll: false });
              })
              .catch(() => {
                notifications.show({
                  title: "Chyba!",
                  message: "Deníkový záznam se nepodařilo vytvořit.",
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
          <Text>Text záznamu</Text>
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