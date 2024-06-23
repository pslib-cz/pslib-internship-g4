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
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      name: "",
      content: "",
    },
    validate: {
      name: (value) => (value.trim() !== "" ? null : "Název je povinný"),
      content: (value) => (value.trim() !== "" ? null : "Obsah je povinný"),
    },
  });
  useEffect(() => {
    setLoading(true);
    fetch(`/api/templates/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Nepodařilo se načíst šablonu.");
      })
      .then((data) => {
        form.setValues({
          name: data.name,
          content: data.content,
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
      <Alert color="red" title="Chyba při načítání nebo ukládání šablony">
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
        <Anchor component={Link} href="/dashboard/templates">
          Šablony
        </Anchor>
        <Text>Editace</Text>
      </Breadcrumbs>
      <Container>
        <LoadingOverlay visible={loading} />
        <Title order={2}>Editace šablony</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            setLoading(true);
            fetch(`/api/templates/${id}`, {
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
                router.push("/dashboard/templates", { scroll: false });
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
            <Button type="submit">Uložit</Button>
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
