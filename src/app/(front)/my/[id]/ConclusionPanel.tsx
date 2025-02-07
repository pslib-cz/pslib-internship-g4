import React, { FC, use, useEffect, useState, useCallback } from "react";
import {
  Alert,
  Card,
  Group,
  Text,
  Title,
  LoadingOverlay,
  Button,
  Radio,
  Box,
  TextInput,
  NumberInput,
} from "@mantine/core";
import { RichTextEditor, Link as TipLink } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useForm } from "@mantine/form";
import {
  InternshipFullRecord,
  InternshipWithCompanyLocationSetUser,
} from "@/types/entities";

enum DisplayMode {
  DISPLAY,
  EDIT,
}

type ConclusionPanelProps = {
  internship: InternshipFullRecord | InternshipWithCompanyLocationSetUser;
  reloadInternshipCallback: () => void;
};

const ConclusionDisplay: FC<{
  setMode: (mode: DisplayMode) => void;
  text: string | null;
}> = ({ setMode, text }) => {
  return (
    <>
      {text ? (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      ) : (
        <Text>Závěrečná zpráva nebyla zadána.</Text>
      )}
      <Group pt="sm">
        <Button onClick={() => setMode(DisplayMode.EDIT)}>Upravit</Button>
      </Group>
    </>
  );
};

const ConclusionEdit: FC<{
  setMode: (mode: DisplayMode) => void;
  internship: InternshipFullRecord | InternshipWithCompanyLocationSetUser;
  reloadInternshipCallback: () => void;
}> = ({ setMode, internship, reloadInternshipCallback }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const form = useForm<{
    text: string;
  }>({
    initialValues: {
      text: internship.conclusion ?? "",
    },
    validate: {
      text: (value) => (value.trim() !== "" ? null : "Text je povinný"),
    },
  });
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Pracoval jsem na projektu XY, který měl za cíl ...",
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
  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        let data = {
          conclusion: values.text,
        };
        try {
          setLoading(true);
          var response = await fetch(
            `/api/internships/${internship.id}/conclusion`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            },
          );
          setLoading(false);
          setMode(DisplayMode.DISPLAY);
          reloadInternshipCallback();
        } catch (error) {
          if (error instanceof Error) {
            setError(error);
          } else {
            setError(new Error("An unknown error occurred"));
          }
          setLoading(false);
        }
      })}
    >
      <Box mt="sm">
        <Text>
          Vlastní shrnutí praxe, jejího průběhu, přínosů a zkušeností získaných
          studentem
        </Text>
        <RichTextEditor editor={editor} {...form.getInputProps("text")}>
          <RichTextEditor.Toolbar>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.Link />
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content />
        </RichTextEditor>
      </Box>
      <Group pt="sm">
        <Button type="submit">Uložit</Button>
        <Button onClick={() => setMode(DisplayMode.DISPLAY)} variant="default">
          Storno
        </Button>
      </Group>
    </form>
  );
};

const ConclusionPanel: FC<ConclusionPanelProps> = ({
  internship,
  reloadInternshipCallback,
}) => {
  const [mode, setMode] = useState(DisplayMode.DISPLAY);
  const switchMode = (mode: DisplayMode) => {
    setMode(mode);
  };

  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Závěrečná zpráva</Title>
      {mode === DisplayMode.EDIT ? (
        <ConclusionEdit
          internship={internship}
          setMode={switchMode}
          reloadInternshipCallback={reloadInternshipCallback}
        />
      ) : (
        <ConclusionDisplay text={internship.conclusion} setMode={switchMode} />
      )}
    </Card>
  );
};

export default ConclusionPanel;
