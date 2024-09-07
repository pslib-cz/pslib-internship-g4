import React, { use, useCallback, useEffect, useState } from "react";
import {
  Title,
  Table,
  Alert,
  TableTr,
  TableTh,
  TableTd,
  Paper,
  TableThead,
  TableTbody,
  Button,
  TableTfoot,
  TextInput,
  Text,
  Box,
  Group,
  Modal,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { Diary } from "@prisma/client";
import { DateTime } from "next-auth/providers/kakao";
import { RichTextEditor, Link as TipLink } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useSession } from "next-auth/react";

enum DisplayMode {
  DISPLAY,
  EDIT,
}

type DiarySectionProps = {
  id: string;
  editable: boolean;
};

const DiaryRecordPanel: React.FC<{
  record: Diary;
  editable: boolean;
  reloadAction: () => void;
}> = ({ record, editable, reloadAction }) => {
  const [mode, setMode] = useState<DisplayMode>(DisplayMode.DISPLAY);
  const { data: session, status } = useSession();
  const form = useForm<{
    date: DateTime;
    text: string;
  }>({
    initialValues: {
      date: new Date(record.date).toISOString().split("T")[0],
      text: record.text ?? "",
    },
    validate: {
      text: (value) => (value.trim() !== "" ? null : "Text je povinný"),
      date: (value) =>
        value !== null ? null : "Datum záznamu musí být vyplněno",
    },
  });
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder:
          "Déšť bubnoval na okno a vytvářel melancholickou symfonii, která dokonale ladila s mým rozpoložením.",
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
    <TableTr>
      {mode === DisplayMode.DISPLAY && (
        <>
          <TableTd>{new Date(record.date).toLocaleDateString()}</TableTd>
          <TableTd>
            <Box dangerouslySetInnerHTML={{ __html: record.text ?? "" }} />
          </TableTd>
          <TableTd>
            {editable && (
              <Group>
                <Button
                  onClick={() => setMode(DisplayMode.EDIT)}
                  variant="default"
                >
                  Upravit
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    fetch(
                      `/api/internships/${record.internshipId}/diary/${record.id}`,
                      {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json",
                        },
                      },
                    )
                      .then((response) => {
                        if (!response.ok) {
                          throw new Error("Došlo k chybě při mazání dat.");
                        }
                        notifications.show({
                          title: "Úspěch!",
                          message: "Záznam byl smazán.",
                          color: "green",
                        });
                        reloadAction();
                      })
                      .catch((error) => {
                        console.error(error);
                        notifications.show({
                          title: "Chyba!",
                          message: "Při mazání záznamu došlo k chybě.",
                          color: "red",
                        });
                      });
                  }}
                >
                  Smazat
                </Button>
              </Group>
            )}
          </TableTd>
        </>
      )}
      {mode === DisplayMode.EDIT && (
        <>
          <TableTd colSpan={3}>
            <form
              onSubmit={form.onSubmit((values) => {
                let data = {
                  date: values.date,
                  text: values.text,
                  userId: session?.user.id,
                };
                fetch(
                  `/api/internships/${record.internshipId}/diary/${record.id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                  },
                )
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Došlo k chybě při ukládání dat.");
                    }
                    notifications.show({
                      title: "Úspěch!",
                      message: "Záznam byl uložen.",
                      color: "green",
                    });
                    reloadAction();
                    setMode(DisplayMode.DISPLAY);
                  })
                  .catch((error) => {
                    console.error(error);
                    notifications.show({
                      title: "Chyba!",
                      message: "Při ukládání záznamu došlo k chybě.",
                      color: "red",
                    });
                  });
              })}
            >
              <TextInput
                withAsterisk
                label="Datum"
                placeholder="Datum"
                required
                type="date"
                value={new Date(record.date).toISOString().split("T")[0]}
                disabled
                {...form.getInputProps("date")}
              />
              <Box mt="sm">
                <Text>Popis činnosti</Text>
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
              <Group mt="sm">
                <Button variant="filled" type="submit">
                  Uložit
                </Button>
                <Button
                  variant="default"
                  onClick={() => setMode(DisplayMode.DISPLAY)}
                >
                  Zrušit
                </Button>
              </Group>
            </form>
          </TableTd>
        </>
      )}
    </TableTr>
  );
};

const DiaryCreateRecordPanel: React.FC<{
  internshipId: string;
  reloadAction: () => void;
}> = ({ internshipId, reloadAction }) => {
  const [error, setError] = useState<Error | null>(null);
  const form = useForm<{
    date: DateTime;
    text: string;
  }>({
    initialValues: {
      date: new Date().toISOString().split("T")[0],
      text: "",
    },
    validate: {
      text: (value) => (value.trim() !== "" ? null : "Text je povinný"),
      date: (value) =>
        value !== null ? null : "Datum záznamu musí být vyplněn",
    },
  });
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder:
          "Déšť bubnoval na okno a vytvářel melancholickou symfonii, která dokonale ladila s mým rozpoložením.",
      }),
      TipLink,
    ],
    content: "",
    onUpdate({ editor }) {
      form.setValues({ text: editor.getHTML() });
    },
  });
  const { data: session, status } = useSession();
  return (
    <TableTr>
      <TableTd colSpan={3}>
        <Title order={3}>Nový záznam</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            let data = {
              internshipId: internshipId,
              date: values.date,
              text: values.text,
              userId: session?.user.id,
            };
            fetch(`/api/internships/${internshipId}/diary`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Došlo k chybě při ukládání dat.");
                }
                notifications.show({
                  title: "Úspěch!",
                  message: "Záznam byl uložen.",
                  color: "green",
                });
                reloadAction();
              })
              .catch((error) => {
                console.error(error);
                notifications.show({
                  title: "Chyba!",
                  message: "Při ukládání záznamu došlo k chybě.",
                  color: "red",
                });
              });
          })}
        >
          <TextInput
            withAsterisk
            label="Datum"
            placeholder="Datum"
            required
            type="date"
            {...form.getInputProps("date")}
          />
          <Box mt="sm">
            <Text>Popis činnosti</Text>
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
          <Box mt="sm">
            <Button variant="filled" type="submit">
              Přidat
            </Button>
          </Box>
        </form>
      </TableTd>
    </TableTr>
  );
};

const DiarySection: React.FC<DiarySectionProps> = ({ id, editable }) => {
  const [records, setRecords] = useState<Diary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const loadData = useCallback((id: string) => {
    setLoading(true);
    fetch(`/api/internships/${id}/diary?orderBy=date`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          setRecords(null);
          setError(new Error("Došlo k chybě při získávání dat."));
          throw new Error("Nepodařilo se načíst záznamy deníku.");
        }
        return response.json();
      })
      .then((data) => {
        setRecords(data.data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    loadData(id);
  }, [loadData, id]);
  return (
    <Paper p="md" mt="md">
      <Title order={2}>Deník</Title>
      {loading && <p>Načítám data...</p>}
      {error && <Alert color="red">{error.message}</Alert>}
      <Table>
        <TableThead>
          <TableTr>
            <TableTh>Datum</TableTh>
            <TableTh>Popis</TableTh>
            <TableTh>Možnosti</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {records && records.length === 0 && (
            <TableTr>
              <TableTd colSpan={3}>
                <Alert color="blue">Žádné záznamy</Alert>
              </TableTd>
            </TableTr>
          )}
          {records &&
            records.length > 0 &&
            records.map((record) => (
              <DiaryRecordPanel
                key={record.id}
                record={record}
                editable={editable}
                reloadAction={() => loadData(id)}
              />
            ))}
        </TableTbody>
        <TableTfoot>
          {editable && (
            <DiaryCreateRecordPanel
              internshipId={id}
              reloadAction={() => loadData(id)}
            />
          )}
        </TableTfoot>
      </Table>
    </Paper>
  );
};

export default DiarySection;
