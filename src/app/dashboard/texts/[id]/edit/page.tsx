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
  Checkbox,
  NativeSelect,
  Title,
  Alert,
  NumberInput,
} from "@mantine/core";
import { RichTextEditor, Link as TipLink } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Text as TextEntity } from "@prisma/client";
import { publicationTargets } from "@/data/lists";

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
  useEffect(() => {
    setLoading(true);
    fetch(`/api/texts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Nepodařilo se načíst místo");
      })
      .then((data) => {
        form.setValues({
          title: data.title,
          content: data.content,
          published: data.published,
          shortable: data.shortable,
          priority: data.priority,
        });
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Náhodný shluk písmenek dávající nějaký smysl.",
      }),
      TipLink,
    ],
    content: "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      form.setValues({ content: editor.getHTML() });
    },
  });
  useEffect(() => {
    editor?.chain().setContent(form.values.content).run();
  }, [editor, form.values.content]);

  if (error) {
    return (
      <Alert color="red" title="Chyba při načítání nebo ukládání textu.">
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
        <Anchor component={Link} href="/dashboard/texts">
          Texty
        </Anchor>
        <Text>Editace</Text>
      </Breadcrumbs>
      <Container>
        <Title order={2}>Editace textu</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            values.published = values.published;
            fetch("/api/texts/" + id, {
              method: "PUT",
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
                  message: "Text byl uložen.",
                  color: "lime",
                });
                router.push("/dashboard/texts", { scroll: false });
              })
              .catch((error) => {
                notifications.show({
                  title: "Chyba!",
                  message: "Text se nepodařilo uložit.",
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
            <Button type="submit">Uložit</Button>
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
