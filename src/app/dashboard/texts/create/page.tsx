"use client";

import React from "react";
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
  NativeSelect,
  Checkbox,
  NumberInput,
} from "@mantine/core";
import { RichTextEditor, Link as TipLink } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { publicationTargets } from "@/data/lists";

const Page = () => {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      title: "",
      content: "",
      published: 0,
      shortable: false,
      priority: 0,
    },
    validate: {
      title: (value) => (value.trim() !== "" ? null : "Titulek je povinný"),
      content: (value) => (value.trim() !== "" ? null : "Obsah je povinný"),
    },
  });
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Spousta písmenek s nějakým významem.",
      }),
      TipLink,
    ],
    content: "",
    onUpdate({ editor }) {
      form.setValues({ content: editor.getHTML() });
    },
  });
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Anchor component={Link} href="/dashboard/texts">
          Texty
        </Anchor>
        <Text>Nový</Text>
      </Breadcrumbs>
      <Container>
        <Title order={2}>Nový text</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            fetch("/api/texts", {
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
                  message: "Text byl vytvořen.",
                  color: "lime",
                });
                router.push("/dashboard/texts", { scroll: false });
              })
              .catch((error) => {
                notifications.show({
                  title: "Chyba!",
                  message: "Nepodařilo se vytvořit text.",
                  color: "red",
                });
              });
          })}
        >
          <TextInput
            withAsterisk
            label="Název"
            placeholder="Nadpis textu"
            {...form.getInputProps("title")}
          />
          <Text>Obsah *</Text>
          <RichTextEditor editor={editor} {...form.getInputProps("content")}>
            <RichTextEditor.Toolbar>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.Link />
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content />
          </RichTextEditor>
          <NativeSelect
            withAsterisk
            label="Místo publikování"
            data={publicationTargets}
            {...form.getInputProps("published")}
          />
          <Checkbox
            my="sm"
            label="Lze krátit"
            {...form.getInputProps("shortable", { type: "checkbox" })}
          />
          <NumberInput
            withAsterisk
            label="Priorita"
            placeholder="0"
            min={0}
            {...form.getInputProps("priority")}
          />
          <Group justify="flex-start" mt="md">
            <Button type="submit">Vytvořit</Button>
            <Button component={Link} href="/dashboard/texts" variant="default">
              Storno
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
};

export default Page;
