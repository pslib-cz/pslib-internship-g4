"use client";

import React, { useState, useEffect } from "react";
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
  NumberInput,
  NativeSelect,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Template } from "@prisma/client";

const Page = () => {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  useEffect(() => {
    fetch("/api/templates?orderBy=name")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
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
      representativeEmail:
        process.env.NEXT_PUBLIC_DEFAULT_SCHOOL_REPRESENTATIVE_EMAIL || "",
      representativePhone:
        process.env.NEXT_PUBLIC_DEFAULT_SCHOOL_REPRESENTATIVE_PHONE || "",
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

  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Anchor component={Link} href="/dashboard/sets">
          Sady
        </Anchor>
        <Text>Nová</Text>
      </Breadcrumbs>
      <Container>
        <Title order={2}>Nová sada</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            fetch("/api/sets", {
              method: "POST",
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
                  message: "Sada byla vytvořena.",
                  color: "lime",
                });
                router.push("/dashboard/sets", { scroll: false });
              })
              .catch((error) => {
                notifications.show({
                  title: "Chyba!",
                  message: "Sadu se nepodařilo vytvořit.",
                  color: "red",
                });
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
            <Button type="submit">Vytvořit</Button>
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
