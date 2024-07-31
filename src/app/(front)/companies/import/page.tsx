"use client";

import React, {
  Suspense,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  Box,
  Text,
  Anchor,
  Breadcrumbs,
  TextInput,
  Title,
  LoadingOverlay,
  ActionIcon,
  Paper,
  Alert,
  Button,
  useComputedColorScheme,
  Container,
  Group,
} from "@mantine/core";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import { RichTextEditor, Link as TipLink } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import "@mantine/tiptap/styles.css";
import { PlaceCoordinates } from "@/types/data";

type CompanyData = {
  ico: string;
  obchodniJmeno: string;
  sidlo: {
    kodStatu: string;
    nazevStatu: string;
    kodKraje: string;
    nazevKraje: string;
    kodOkresu: string;
    nazevOkresu: string;
    kodObce: string;
    nazevObce: string;
    kodMestskeCastiObvodu: string;
    nazevMestskeCastiObvodu: string;
    nazevUlice: string;
    cisloDomovni: string;
    kodCastiObce: string;
    cisloOrientacni: string;
    nazevCastiObce: string;
    kodAdresnihoMista: string;
    psc: string;
    textovaAdresa: string;
    typCisloDomovni: string;
    standardizaceAdresy: boolean;
  };
  pravniForma: string;
  financniUrad: string;
  datumVzniku: string;
  datumZapisu: string;
  icoId: string;
};

const CompanyDisplay = ({ id }: { id: string }) => {
  const [compData, setCompData] = useState<CompanyData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [companyStatus, setCompanyStatus] = useState<
    "exists" | "error" | "missing" | null
  >(null);
  const colorScheme = useComputedColorScheme();
  const router = useRouter();

  useEffect(() => {
    setError(null);
    fetch(`${process.env.NEXT_PUBLIC_ARES_URL}${id.padStart(8, "0")}`, {})
      .then((response) => {
        if (response.status === 404) {
          setCompData(null);
          throw new Error("Firma nebyla nalezena.");
        }
        if (!response.ok) {
          setCompData(null);
          throw new Error("Chyba v komunikaci.");
        }
        return response.json();
      })
      .then((data) => {
        setCompData(data);
      })
      .catch((error) => {
        setError(error);
      });
    setCompanyStatus(null);
    fetch(`/api/companies/?taxNum=${id}`, {})
      .then((response) => {
        if (!response.ok) {
          setCompanyStatus("error");
        }
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          setCompanyStatus("exists");
        } else {
          setCompanyStatus("missing");
        }
      });
  }, [id]);
  const form = useForm({
    initialValues: {
      description: "Popis" || undefined,
      website: "" || undefined,
    },
    validate: {},
  });
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Jedna z největších megakorporací světa.",
      }),
      TipLink,
    ],
    content: "",
    onUpdate({ editor }) {
      form.setValues({ description: editor.getHTML() });
    },
  });
  if (error) {
    return <Alert color="red">{error.message}</Alert>;
  }
  return (
    <Paper
      shadow="xs"
      p="xl"
      mt="md"
      bg={
        colorScheme === "light"
          ? "var(--mantine-color-gray-1)"
          : "var(--mantine-color-gray-8)"
      }
    >
      <Title order={3}>Získaná data</Title>
      <Text fw={700}>IČO</Text>
      <Text>{compData?.ico ?? "?"}</Text>
      <Text fw={700}>Obchodní název</Text>
      <Text>{compData?.obchodniJmeno ?? "?"}</Text>
      <Text fw={700}>Stát</Text>
      <Text>{compData?.sidlo.nazevKraje ?? "?"}</Text>
      <Text fw={700}>Okres</Text>
      <Text>{compData?.sidlo.nazevOkresu ?? "?"}</Text>
      <Text fw={700}>Obec</Text>
      <Text>{compData?.sidlo.nazevObce ?? "?"}</Text>
      <Text fw={700}>Ulice</Text>
      <Text>{compData?.sidlo.nazevUlice ?? "?"}</Text>
      <Text fw={700}>Číslo popisné</Text>
      <Text>{compData?.sidlo.cisloDomovni ?? "?"}</Text>
      <Text fw={700}>Číslo orientační</Text>
      <Text>{compData?.sidlo.cisloOrientacni ?? "?"}</Text>
      <Text fw={700}>PSČ</Text>
      <Text>{compData?.sidlo.psc ?? "?"}</Text>
      <Box mt="md">
        {companyStatus === "exists" ? (
          <Alert color="green">
            Firma s tímto IČO již existuje v databázi.
          </Alert>
        ) : null}
        {companyStatus === "error" ? (
          <Alert color="red">Chyba při ověřování existence firmy.</Alert>
        ) : null}
        {companyStatus === "missing" ? (
          <form
            onSubmit={form.onSubmit(
              // Geocoding
              async (values) => {
                let coords: PlaceCoordinates = { lat: null, lon: null };
                await fetch(`/api/locations/geo`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    country: compData?.sidlo.nazevStatu ?? "",
                    municipality: compData?.sidlo.nazevObce ?? "",
                    street:
                      compData?.sidlo.nazevUlice ??
                      compData?.sidlo.nazevCastiObce ??
                      "",
                    descNumber: compData?.sidlo.cisloDomovni ?? "",
                    orientNumber: compData?.sidlo.cisloOrientacni ?? "",
                  }),
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Chyba při geokódování adresy firmy.");
                    }
                    return response.json();
                  })
                  .then((data: PlaceCoordinates) => {
                    notifications.show({
                      title: "Úspěch!",
                      message: `Geokódování bylo úspěšné: ${data.lat}, ${data.lon}.`,
                      color: "green",
                    });
                    if (data !== null) coords = data;
                  })
                  .catch((error) => {
                    notifications.show({
                      title: "Chyba!",
                      message: "Při geokódování adresy firmy došlo k chybě.",
                      color: "red",
                    });
                  });
                fetch(`/api/locations`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    country: compData?.sidlo.nazevStatu ?? "",
                    municipality: compData?.sidlo.nazevObce ?? "",
                    postalCode: compData?.sidlo.psc ?? "",
                    street: compData?.sidlo.nazevUlice ?? "",
                    orientNo: compData?.sidlo.cisloOrientacni ?? "",
                    descNo: compData?.sidlo.cisloDomovni ?? "",
                    latitude:
                      coords.lat === null ? null : coords.lat.toString(),
                    longitude:
                      coords.lon === null ? null : coords.lon.toString(),
                  }),
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error(
                        "Chyba při přidávání adresy firmy do databáze.",
                      );
                    }
                    return response.json();
                  })
                  .then((data) => {
                    let locationId = data.id;
                    notifications.show({
                      title: "Úspěch!",
                      message: "Místo bylo vytvořeno.",
                      color: "green",
                    });
                    fetch(`/api/companies`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        companyIdentificationNumber: Number(compData?.ico),
                        name: compData?.obchodniJmeno,
                        locationId: locationId,
                        description: values.description ?? "",
                        website: values.website ?? "",
                      }),
                    })
                      .then((response) => {
                        if (!response.ok) {
                          throw new Error(
                            "Chyba při přidávání firmy do databáze.",
                          );
                        }
                        return response.json();
                      })
                      .then((data) => {
                        notifications.show({
                          title: "Úspěch!",
                          message: `Záznam firmy byl úspěšně vytvořen.`,
                          color: "green",
                        });
                        router.push(`/companies/${data.id}`);
                      })
                      .catch((error) => {
                        notifications.show({
                          title: "Chyba!",
                          message:
                            "Při přidávání firmy do databáze došlo k chybě.",
                          color: "red",
                        });
                      });
                  })
                  .catch((error) => {
                    notifications.show({
                      title: "Chyba!",
                      message: "Při přidávání adresy firmy došlo k chybě.",
                      color: "red",
                    });
                  });
              },
            )}
          >
            <Text>
              K přidávané firmě můžete (ale nemusíte) přidat krátký textový
              popis historie firmy, činnosti a zaměření firmy. Obecně informace,
              které by mohly Vaším spolužákum pomoci s výběrem firmy na praxi.
            </Text>
            <Text>
              Tyto dodatečné informace už pak nebudete mít možnost upravit.
              Případné úpravy mohou provést pouze správci aplikace.
            </Text>
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
            <Group justify="flex-start" mt="md">
              <Button type="submit">Přidat firmu do databáze</Button>
              <Button component={Link} href="/companies" variant="default">
                Storno
              </Button>
            </Group>
          </form>
        ) : null}
      </Box>
    </Paper>
  );
};

const Page = () => {
  const [compId, setCompId] = useState<string | undefined>(undefined);
  const idInputRef = useRef<HTMLInputElement>(null);
  const handleIdChange = useCallback((input: string | undefined) => {
    setCompId(input);
  }, []);
  return (
    <>
      <Breadcrumbs separatorMargin="md" my="xs">
        <Anchor component={Link} href="/">
          Titulní stránka
        </Anchor>
        <Anchor component={Link} href="/companies">
          Firmy
        </Anchor>
        <Text>Import</Text>
      </Breadcrumbs>
      <Container mt="md">
        <Title order={2}>Import firmy přes ARES</Title>
        <Box mb="md">
          <Text>
            Údaje firmy je možné automaticky načíst ze státní databáze{" "}
            <Anchor href="https://ares.gov.cz/">
              Administrativní registr ekonomických subjektů
            </Anchor>
          </Text>
          <Text>Pro načtení údajů je nutné zadat IČO firmy:</Text>
          <TextInput
            id="ico"
            label="IČO"
            placeholder="12345678"
            ref={idInputRef}
            rightSection={
              <ActionIcon
                mr="sm"
                onClick={(e) => handleIdChange(idInputRef.current?.value)}
              >
                <IconArrowRight />
              </ActionIcon>
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleIdChange(idInputRef.current?.value);
              }
            }}
          />
        </Box>
        <Suspense fallback={<LoadingOverlay />}>
          {compId ? (
            <CompanyDisplay id={compId} />
          ) : (
            <Alert>Nebylo zadáno IČO firmy.</Alert>
          )}
        </Suspense>
      </Container>
    </>
  );
};

export default Page;
