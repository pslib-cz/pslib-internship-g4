"use client";

import React from "react";
import { Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  TextInput,
  Button,
  Group,
  Container,
  Textarea,
  Anchor,
  Breadcrumbs,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      name: "",
      content: "<h1>Dohoda o firemní praxi</h1>",
    },
    validate: {
      name: (value) => (value.trim() !== "" ? null : "Název je povinný"),
      content: (value) => (value.trim() !== "" ? null : "Obsah je povinný"),
    },
  });
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Anchor component={Link} href="/dashboard/templates">
          Šablony
        </Anchor>
        <Text>Nový</Text>
      </Breadcrumbs>
      <Container>
        <Title order={2}>Nová šablona</Title>
        <form
          onSubmit={form.onSubmit(
            (values: { name: string; content: string }) => {
              fetch("/api/templates", {
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
                    message: "Šablona byla vytvořena.",
                    color: "lime",
                  });
                  router.push("/dashboard/templates", { scroll: false });
                })
                .catch((error) => {
                  notifications.show({
                    title: "Chyba!",
                    message: "Nepodařilo se vytvořit šablonu.",
                    color: "red",
                  });
                });
            },
          )}
        >
          <TextInput
            withAsterisk
            label="Název"
            placeholder="Souvislá praxe 202x"
            {...form.getInputProps("name")}
          />
          <Textarea
            label="Obsah"
            description="Obsah formátujte jako HTML kód"
            placeholder="<h1>Dohoda o školní praxi</h1>"
            autosize
            minRows={10}
            {...form.getInputProps("content")}
          />
          <Group justify="flex-start" mt="md">
            <Button type="submit">Vytvořit</Button>
            <Button
              component={Link}
              href="/dashboard/templates"
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
