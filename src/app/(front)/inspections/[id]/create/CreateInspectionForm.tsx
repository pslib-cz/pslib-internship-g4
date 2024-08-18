import React, { useEffect, useState, FC } from "react";
import { notifications } from "@mantine/notifications";
import { DateInput } from '@mantine/dates';
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
import { useSearchParams } from "next/navigation";
import { inspectionResults, inspectionTypes } from "@/data/lists";
import { useSession } from "next-auth/react";

type CreateInspectionFormProps = {
    internshipId: string;
    };

const CreateInspectionForm: FC<CreateInspectionFormProps> = ({internshipId}) => {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      result: "0",
      kind: "0",
      note: "",
      date: new Date().toISOString().split("T")[0],
    },
    validate: {
        result: (value) => (value ? null : "Výsledek kontroly musí být vybrán."),
        kind: (value) => (value ? null : "Způsob kontroly musí být vybrán."),
        date: (value) => (value ? null : "Datum kontroly musí být vyplněno."),
    },
  });
  const editorNote = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Kontrola proběhla bez problémů.",
      }),
      TipLink,
    ],
    content: "",
    onUpdate({ editor }) {
      form.setValues({ note: editor.getHTML() });
    },
  });
  return (
    <form
      onSubmit={form.onSubmit((values) => {
        fetch("/api/inspections", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({internshipId: internshipId, inspectionUserId: session?.user.id, ...values}),
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
            router.push(`/inspections/${internshipId}/list`, { scroll: false });
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
      <TextInput
      label="Datum"
      placeholder="1.1.2025"
      type="date"
      withAsterisk
      {...form.getInputProps("date")}
    />
      <NativeSelect
        withAsterisk
        label="Výsledek"
        description={`Jak kontrola dopadla?`}
        data={inspectionResults}
        {...form.getInputProps("result")}
      />
      <NativeSelect
        withAsterisk
        label="Způsob"
        data={inspectionTypes}
        {...form.getInputProps("kind")}
      />
      <Text>Poznámka</Text>
      <RichTextEditor
        editor={editorNote}
        {...form.getInputProps("note")}
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
      <Group justify="flex-start" mt="md">
        <Button type="submit">Vytvořit</Button>
        <Button component={Link} href={`/inspections/${internshipId}/list`} variant="default">
          Storno
        </Button>
      </Group>
    </form>
  );
};

export default CreateInspectionForm;
