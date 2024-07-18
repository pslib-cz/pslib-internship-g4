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
  Checkbox,
  NativeSelect,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Set, Template } from "@prisma/client";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  useEffect(() => {
    fetch("/api/templates?orderBy=name")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Při získávání dat šablony došlo k chybě!");
        }
        return response.json();
      })
      .then((data) => {
        setTemplates(
          data.data.map((template: Template) => ({
            label: `${template.name}`,
            value: template.id,
          })),
        );
      })
      .catch((error) => {
        notifications.show({
          title: "Chyba!",
          message: "Nepodařilo se načíst seznam šablon.",
          color: "red",
        });
      });
  }, []);

  const form = useForm({
    initialValues: {
      name: undefined,
      schoolName: process.env.NEXT_PUBLIC_DEFAULT_SCHOOL_NAME || "",
      active: true,
      editable: true,
      start: new Date().toISOString().split("T")[0],
      end: new Date().toISOString().split("T")[0],
      representativeName:
        process.env.NEXT_PUBLIC_DEFAULT_SCHOOL_REPRESENTATIVE || "",
      representativeEmail: process.env.NEXT_PUBLIC_DEFAULT_SCHOOL_EMAIL || "",
      representativePhone: process.env.NEXT_PUBLIC_DEFAULT_SCHOOL_PHONE || "",
      continuous: false,
      hoursDaily: 8,
      daysTotal: 10,
      year: new Date().getFullYear() || null,
      templateId: undefined,
    },
    validate: {
      name: (value) =>
        String(value).trim() !== "" ? null : "Název je povinný",
      schoolName: (value) =>
        value.trim() !== "" ? null : "Název školy musí být vyplněn",
      representativeName: (value) =>
        value.trim() !== "" ? null : "Jméno zástupce školy musí být vyplněno",
      year: (value) => (value !== null ? null : "Školní rok musí být vyplněn"),
      start: (value) =>
        value !== null ? null : "Začátek praxe musí být vyplněn",
      end: (value) => (value !== null ? null : "Konec praxe musí být vyplněn"),
      daysTotal: (value) =>
        value !== null ? null : "Počet dní musí být vyplněn",
      hoursDaily: (value) =>
        value !== null ? null : "Počet hodin musí být vyplněn",
      templateId: (value) =>
        value !== undefined || value !== ""
          ? null
          : "Tisková šablona musí být vyplněna",
    },
  });
  useEffect(() => {
    setLoading(true);
    fetch(`/api/sets/${id}`, {
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
          schoolName:
            data.schoolName || process.env.NEXT_PUBLIC_DEFAULT_SCHOOL_NAME,
          active: data.active || false,
          editable: data.editable || false,
          start: new Date(data.start ?? null).toISOString().split("T")[0],
          end: new Date(data.end ?? null).toISOString().split("T")[0],
          representativeName:
            data.representativeName ||
            process.env.NEXT_PUBLIC_DEFAULT_SCHOOL_REPRESENTATIVE ||
            "",
          representativeEmail:
            data.representativeEmail ||
            process.env.NEXT_PUBLIC_DEFAULT_SCHOOL_EMAIL ||
            "",
          representativePhone:
            data.representativePhone ||
            process.env.NEXT_PUBLIC_DEFAULT_SCHOOL_PHONE ||
            "",
          continuous: data.continuous || false,
          hoursDaily: data.hoursDaily || 8,
          daysTotal: data.daysTotal || 10,
          year: data.year || new Date().getFullYear() || null,
          templateId: data.templateId || undefined,
        });
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
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
        <Anchor component={Link} href="/dashboard/sets">
          Sady
        </Anchor>
        <Text>Editace</Text>
      </Breadcrumbs>
      <Container>
        <LoadingOverlay visible={loading} />
        <Title order={2}>Editace sady</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            setLoading(true);
            fetch(`/api/sets/${id}`, {
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
                router.push("/dashboard/sets", { scroll: false });
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
            label="Název sady"
            placeholder="Průběžná/souvislá praxe"
            {...form.getInputProps("name")}
          />
          <Title order={3}>Škola</Title>
          <TextInput
            withAsterisk
            label="Název školy"
            placeholder="Naše škola"
            {...form.getInputProps("schoolName")}
          />
          <TextInput
            withAsterisk
            label="Jméno zástupce školy"
            placeholder="František Černý"
            {...form.getInputProps("representativeName")}
          />
          <TextInput
            label="Email zástupce školy"
            placeholder="frantisek.cerny@nase.skola.cz"
            {...form.getInputProps("representativeEmail")}
          />
          <TextInput
            label="Telefon zástupce školy"
            placeholder="+420 111 111 111"
            {...form.getInputProps("representativePhone")}
          />
          <Title order={3}>Vlastnosti praxí</Title>
          <NumberInput
            withAsterisk
            label="Školní rok"
            placeholder="2024"
            {...form.getInputProps("year")}
          />
          <TextInput
            withAsterisk
            label="Začátek praxe"
            type="date"
            placeholder="1.1.2024"
            {...form.getInputProps("start")}
          />
          <TextInput
            withAsterisk
            label="Konec praxe"
            type="date"
            placeholder="1.1.2024"
            {...form.getInputProps("end")}
          />
          <NumberInput
            withAsterisk
            label="Počet hodin denně"
            placeholder="8"
            {...form.getInputProps("hoursDaily")}
          />
          <NumberInput
            withAsterisk
            label="Celkový počet dní"
            placeholder="10"
            {...form.getInputProps("daysTotal")}
          />
          <Checkbox
            my="sm"
            label="Průběžná praxe"
            {...form.getInputProps("continuous", { type: "checkbox" })}
          />
          <Checkbox
            my="sm"
            label="Aktivní"
            {...form.getInputProps("active", { type: "checkbox" })}
          />
          <Checkbox
            my="sm"
            label="Editovatelné praxe"
            {...form.getInputProps("editable", { type: "checkbox" })}
          />
          <NativeSelect
            withAsterisk
            label="Tisková šablona"
            description="Nové šablony lze vytvořit v sekci Šablony"
            data={[{ label: "--", value: "" }, ...templates]}
            {...form.getInputProps("templateId")}
          />
          <Group justify="flex-start" mt="md">
            <Button type="submit">Uložit</Button>
            <Button component={Link} href="/dashboard/sets" variant="default">
              Storno
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
};

export default Page;
