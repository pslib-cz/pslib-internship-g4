"use client";

import React, { useState, useEffect } from "react";
import {
  Title,
  LoadingOverlay,
  Text,
  Alert,
  Breadcrumbs,
  Anchor,
  Container,
  TextInput,
  Button,
  Group,
  Textarea,
  Checkbox,
  NativeSelect,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Location } from "@prisma/client";
import { notifications } from "@mantine/notifications";
import { RichTextEditor, Link as TipLink } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const form = useForm({
    initialValues: {
      name: "",
      companyIdentificationNumber: "" || undefined,
      active: false,
      description: "",
      website: "" || undefined,
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
        placeholder: "<p>Jedna z největších megakorporací světa.</p>",
      }),
      TipLink,
    ],
    content: form.values.description,
    onUpdate({ editor }) {
      form.setValues({ description: editor.getHTML() });
    },
  });
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
  useEffect(() => {
    setLoading(true);
    fetch(`/api/companies/${id}`, {
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
          name: data.name,
          companyIdentificationNumber: data.companyIdentificationNumber,
          active: data.active,
          description: data.description,
          website: data.website,
          locationId: data.location.id,
        });
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  useEffect(() => {
    editor?.chain().setContent(form.values.description).run();
  }, [editor, form]);

  if (error) {
    return (
      <Alert color="red" title="Chyba při načítání nebo ukládání firmy">
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
        <Anchor component={Link} href="/dashboard/companies">
          Firmy
        </Anchor>
        <Text>Editace</Text>
      </Breadcrumbs>
      <Container>
        <LoadingOverlay visible={loading} />
        <Title order={2}>Editace firmy</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            setLoading(true);
            fetch(`/api/companies/${id}`, {
              method: "PUT",
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
                  message: "Data byla uložena.",
                  color: "lime",
                });
                router.push("/dashboard/companies", { scroll: false });
              })
              .catch((error) => {
                notifications.show({
                  title: "Chyba!",
                  message: "Nepodařilo se uložit data.",
                  color: "red",
                });
                setError(error);
              })
              .finally(() => {
                setLoading(false);
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
            <Button type="submit">Uložit</Button>
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
