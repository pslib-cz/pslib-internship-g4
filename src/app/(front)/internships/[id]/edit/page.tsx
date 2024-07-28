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
} from "@mantine/core";
import { RichTextEditor, Link as TipLink } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Location, Company, User, Set } from "@prisma/client";
import { internshipKinds } from "@/data/lists";

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [sets, setSets] = useState([]);
  useEffect(() => {
    setLoading(true);
    fetch("/api/companies?orderBy=name")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Při komunikaci se serverem došlo k chybě.");
        }
        return response.json();
      })
      .then((data) => {
        setCompanies(
          data.data.map((company: Company) => ({
            label: `${company.name} ${company.companyIdentificationNumber ? "(" + company.companyIdentificationNumber + ")" : ""}`,
            value: company.id,
          })),
        );
      })
      .catch((error) => {
        notifications.show({
          title: "Chyba!",
          message: "Nepodařilo se načíst lokace.",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
    setLoading(true);
    fetch("/api/sets?orderBy=year")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Při komunikaci se serverem došlo k chybě.");
        }
        return response.json();
      })
      .then((data) => {
        setSets(
          data.data.map((set: Set) => ({
            label: `${set.year} / ${set.name}`,
            value: set.id,
          })),
        );
      })
      .catch((error) => {
        notifications.show({
          title: "Chyba!",
          message: "Nepodařilo se načíst lokace.",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const form = useForm({
    initialValues: {
      companyRepName: "",
      companyRepEmail: "",
      companyRepPhone: "",
      companyMentorName: "",
      companyMentorEmail: "",
      companyMentorPhone: "",
      jobDescription: "",
      additionalInfo: "",
      appendixText: "",
      classname: "",
      companyId: undefined,
      setId: undefined,
      kind: 0,
    },
    validate: {
      companyRepName: (value) =>
        value.trim() !== "" ? null : "Jméno zástupce firmy musí být vyplněno.",
      jobDescription: (value) =>
        value.trim() !== ""
          ? null
          : "Popis zaměstnání firmy musí být vyplněno.",
      classname: (value) =>
        value.trim() !== "" ? null : "Název třídy musí být vyplněn.",
      companyId: (value) => (value ? null : "Firma musí být vybrána."),
      setId: (value) => (value ? null : "Sada praxí musí být vybrána."),
      kind: (value) => (value ? null : "Způsob praxe musí být vybrán."),
    },
  });
  useEffect(() => {
    setLoading(true);
    fetch(`/api/internships/${id}`, {
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
          companyRepName: data.companyRepName,
          companyRepEmail: data.companyRepEmail,
          companyRepPhone: data.companyRepPhone,
          companyMentorName: data.companyMentorName,
          companyMentorEmail: data.companyMentorEmail,
          companyMentorPhone: data.companyMentorPhone,
          jobDescription: data.jobDescription,
          additionalInfo: data.additionalInfo,
          appendixText: data.appendixText,
          classname: data.classname,
          companyId: data.companyId,
          setId: data.setId,
          kind: data.kind,
        });
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const editorDescription = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Budu dřít od úsvitu do soumraku. Oka nezamhouřím.",
      }),
      TipLink,
    ],
    content: "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      form.setValues({ jobDescription: editor.getHTML() });
    },
  });
  const editorInfo = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Najdete mě přesně tam, kde budu.",
      }),
      TipLink,
    ],
    content: "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      form.setValues({ additionalInfo: editor.getHTML() });
    },
  });
  const editorAppendix = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Student musí dodržovat naše bezpečnostní předpisy..",
      }),
      TipLink,
    ],
    content: "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      form.setValues({ appendixText: editor.getHTML() });
    },
  });
  useEffect(() => {
    editorDescription?.chain().setContent(form.values.jobDescription).run();
  }, [editorDescription, form.values.jobDescription]);
  useEffect(() => {
    editorInfo?.chain().setContent(form.values.additionalInfo).run();
  }, [editorInfo, form.values.additionalInfo]);
  useEffect(() => {
    editorAppendix?.chain().setContent(form.values.appendixText).run();
  }, [editorAppendix, form.values.appendixText]);

  if (error) {
    return (
      <Alert color="red" title="Chyba při načítání nebo ukládání praxe">
        {error}
      </Alert>
    );
  }
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/">
          Titulní stránka
        </Anchor>
        <Anchor component={Link} href="/internships">
          Praxe
        </Anchor>
        <Text>Editace</Text>
      </Breadcrumbs>
      <Container>
        <Title order={2}>Editace praxe</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            fetch("/api/internships/" + id, {
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
                  message: "Praxe byla uložena.",
                  color: "lime",
                });
                router.push("/internships", { scroll: false });
              })
              .catch((error) => {
                notifications.show({
                  title: "Chyba!",
                  message: "Praxi se nepodařilo uložit.",
                  color: "red",
                });
              });
          })}
        >
          <NativeSelect
            withAsterisk
            label="Sada praxí"
            description={`Základní definice vlastností praxí.`}
            data={[{ label: "--", value: "" }, ...sets]}
            {...form.getInputProps("setId")}
          />
          <TextInput
            withAsterisk
            label="Název třídy"
            placeholder="X2A"
            {...form.getInputProps("classname")}
          />
          <Title order={3}>Firma</Title>
          <NativeSelect
            withAsterisk
            label="Firma"
            description={`Pokud se zde firma nenachází, musíte ji nejprve vytvořit v sekci Firmy`}
            data={[{ label: "--", value: "" }, ...companies]}
            {...form.getInputProps("companyId")}
          />
          <Text>Popis zaměstnání</Text>
          <RichTextEditor
            editor={editorDescription}
            {...form.getInputProps("jobDescription")}
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
          <NativeSelect
            withAsterisk
            label="Způsob praxe"
            description={`Povaha přítomnosti studenta na praxi..`}
            data={[{ label: "--", value: "" }, ...internshipKinds]}
            {...form.getInputProps("kind")}
          />
          <Text>Pokyny ke kontaktu</Text>
          <RichTextEditor
            editor={editorInfo}
            {...form.getInputProps("additionalInfo")}
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
          <Text>Dodatky ke smlouvě</Text>
          <RichTextEditor
            editor={editorAppendix}
            {...form.getInputProps("appendixText")}
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
          <Title order={3}>Zástupce firmy</Title>
          <Text>
            Osoba oprávněná podepsat smlouvu za firmu. Zároveň dodatečný
            kontakt.
          </Text>
          <TextInput
            withAsterisk
            label="Jméno"
            placeholder="Marcela Drápalová"
            {...form.getInputProps("companyRepName")}
          />
          <TextInput
            label="Email"
            type="email"
            placeholder="marcela.drapalova@firma.test"
            {...form.getInputProps("companyRepEmail")}
          />
          <TextInput
            label="Telefon"
            type="tel"
            placeholder="+420 123 456 789"
            {...form.getInputProps("companyRepPhone")}
          />
          <Title order={3}>Kontaktní osoba</Title>
          <Text>Zaměstnanec, který se bude studentovi na praxi věnovat.</Text>
          <Text>
            Není potřeba vyplnit, pokud jde o stejnou osobu, jako je zástupce
            firmy.
          </Text>
          <TextInput
            withAsterisk
            label="Jméno"
            placeholder="Jaroslav Pazour"
            {...form.getInputProps("companyMentorName")}
          />
          <TextInput
            label="Email"
            type="email"
            placeholder="jaroslav.pazour@firma.test"
            {...form.getInputProps("companyMentorEmail")}
          />
          <TextInput
            label="Telefon"
            type="tel"
            placeholder="+420 123 456 789"
            {...form.getInputProps("companyMentorPhone")}
          />
          <Group justify="flex-start" mt="md">
            <Button type="submit">Uložit</Button>
            <Button
              component={Link}
              href="/internships"
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
