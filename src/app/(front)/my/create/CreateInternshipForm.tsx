import React, { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import {
  TextInput,
  Button,
  Group,
  Text,
  NativeSelect,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RichTextEditor, Link as TipLink } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Company, Set } from "@prisma/client";
import { internshipKinds } from "@/data/lists";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

const CreateInternshipForm = () => {
  const searchParams = useSearchParams();
  const requestedCompany = searchParams.get("company");
  const requestedSet = searchParams.get("set");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
          message: "Nepodařilo se načíst firmy.",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
    fetch("/api/sets?editable=true&orderBy=year")
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
          message: "Nepodařilo se načíst sady.",
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
      companyId: requestedCompany ?? undefined,
      setId: requestedSet ?? undefined,
      kind: "0",
    },
    validate: {
      companyRepName: (value) =>
        value.trim() !== "" ? null : "Jméno zástupce firmy musí být vyplněno.",
      jobDescription: (value) =>
        value.trim() !== "" ? null : "Popis praxe musí být vyplněn.",
      classname: (value) =>
        value.trim() !== "" ? null : "Název třídy musí být vyplněn.",
      companyId: (value) => (value ? null : "Firma musí být vybrána."),
      setId: (value) => (value ? null : "Sada praxí musí být vybrána."),
      kind: (value) => (value ? null : "Způsob praxe musí být vybrán."),
    },
  });
  const editorDescription = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Budu dřít od úsvitu do soumraku. Oka nezamhouřím.",
      }),
      TipLink,
    ],
    content: "",
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
    onUpdate({ editor }) {
      form.setValues({ additionalInfo: editor.getHTML() });
    },
  });
  const editorAppendix = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Student musí dodržovat naše bezpečnostní předpisy...",
      }),
      TipLink,
    ],
    content: "",
    onUpdate({ editor }) {
      form.setValues({ appendixText: editor.getHTML() });
    },
  });
  return (
    <form
      onSubmit={form.onSubmit((values) => {
        fetch("/api/internships", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: session?.user.id, ...values }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Při komunikaci se serverem došlo k chybě.");
            }
            return response.json();
          })
          .then((data) => {
            notifications.show({
              title: "Povedlo se!",
              message: "Praxe byla vytvořena.",
              color: "lime",
            });
            router.push("/my/" + data.id, { scroll: false });
          })
          .catch((error) => {
            notifications.show({
              title: "Chyba!",
              message: "Praxi se nepodařilo vytvořit.",
              color: "red",
            });
          });
      })}
    >
      <NativeSelect
        withAsterisk
        label="Sada praxí"
        description={`Základní definice vlastností této praxe.`}
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
      <Text>Popis zaměstnání *</Text>
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
        description={`Povaha přítomnosti na praxi.`}
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
        Osoba oprávněná podepsat smlouvu za firmu. Zároveň dodatečný kontakt.
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
        Není potřeba vyplnit, pokud jde o stejnou osobu, jako je zástupce firmy.
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
        <Button type="submit">Vytvořit</Button>
        <Button component={Link} href="/my" variant="default">
          Storno
        </Button>
      </Group>
    </form>
  );
};

export default CreateInternshipForm;
