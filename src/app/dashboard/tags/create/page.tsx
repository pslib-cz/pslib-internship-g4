"use client";

import React from "react";
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
  ColorInput,
  NativeSelect,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tagTypes } from "@/data/lists";

const Page = () => {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      text: "",
      type: "5",
      color: "#333333",
      background: "#dddddd",
    },
    validate: {
      text: (value) => (value.trim() !== "" ? null : "Text je povinný"),
      type: (value) => (value.trim() !== "" ? null : "Typ je povinný"),
    },
  });

  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Anchor component={Link} href="/dashboard/tags">
          Značky
        </Anchor>
        <Text>Nová</Text>
      </Breadcrumbs>
      <Container>
        <Title order={2}>Nová značka</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            fetch("/api/tags", {
              method: "POST",
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
                  message: "Značka byla vytvořena.",
                  color: "lime",
                });
                router.push("/dashboard/tags", { scroll: false });
              })
              .catch((error) => {
                notifications.show({
                  title: "Chyba!",
                  message: "Značku se nepodařilo vytvořit.",
                  color: "red",
                });
              });
          })}
        >
          <TextInput
            withAsterisk
            label="Text"
            placeholder=""
            {...form.getInputProps("text")}
          />
          <NativeSelect
            withAsterisk
            label="Typ"
            data={tagTypes}
            {...form.getInputProps("type")}
          />
          <ColorInput label="Barva" {...form.getInputProps("color")} />
          <ColorInput label="Pozadí" {...form.getInputProps("background")} />
          <Group justify="flex-start" mt="md">
            <Button type="submit">Vytvořit</Button>
            <Button component={Link} href="/dashboard/tags" variant="default">
              Storno
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
};

export default Page;
