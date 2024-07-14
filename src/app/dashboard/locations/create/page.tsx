"use client";

import React from "react";
import { Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  Box,
  TextInput,
  Button,
  Group,
  Container,
  NumberInput,
  Anchor,
  Breadcrumbs,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const form = useForm<{
    country: string;
    municipality: string | undefined;
    postalCode: number | undefined;
    street: string | undefined;
    descNo: number | undefined;
    orientNo: string;
    latitude: number | undefined;
    longitude: number | undefined;
  }>({
    initialValues: {
      country: "Česko",
      municipality: "",
      postalCode: undefined,
      street: "",
      descNo: undefined,
      orientNo: "",
      latitude: undefined,
      longitude: undefined,
    },
    validate: {
      country: (value) => (value.trim() !== "" ? null : "Stát je povinný"),
      postalCode: (value) => {
        if (value == undefined) return null;
        if (value < 10000 && value > 99999)
          return "PSČ musí být v rozmezí 00000 - 99999";
        return null;
      },
    },
  });
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Anchor component={Link} href="/dashboard/locations">
          Místa
        </Anchor>
        <Text>Nové</Text>
      </Breadcrumbs>
      <Container>
        <Title order={2}>Nové místo</Title>
        <form
          onSubmit={form.onSubmit(
            (values: {
              country: string;
              municipality: string | undefined;
              postalCode: number | undefined;
              street: string | undefined;
              descNo: number | undefined;
              orientNo: string;
              latitude: number | undefined;
              longitude: number | undefined;
            }) => {
              console.log(values);
              fetch(`/api/locations`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  country: values.country,
                  municipality: values.municipality ?? "",
                  street: values.street ?? null,
                  descNo: values.descNo ? Number(values.descNo) : null,
                  orientNo: String(values.orientNo) ?? null,
                  postalCode: values.postalCode ?? null,
                  latitude: values.latitude ?? null,
                  longitude: values.longitude ?? null,
                  text:
                    values.country +
                    ", " +
                    values.municipality +
                    ", " +
                    values.street +
                    " " +
                    values.descNo +
                    "/" +
                    values.orientNo,
                }),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  return response.json();
                })
                .then((result) => {
                  notifications.show({
                    title: "Povedlo se!",
                    message: "Místo bylo vytvořeno.",
                    color: "lime",
                  });
                  router.push("/dashboard/locations", { scroll: false });
                })
                .catch((error) => {
                  notifications.show({
                    title: "Chyba!",
                    message: "Při vytváření místa došlo k chybě.",
                    color: "red",
                  });
                });
            },
          )}
        >
          <TextInput
            withAsterisk
            label="Stát"
            placeholder="Álfheimr"
            {...form.getInputProps("country")}
          />
          <TextInput
            label="Obec"
            placeholder="Ljósálfheimr"
            {...form.getInputProps("municipality")}
          />
          <NumberInput
            label="PSČ"
            placeholder="00000"
            {...form.getInputProps("postalCode")}
          />
          <TextInput
            label="Ulice"
            placeholder="Bifröst"
            {...form.getInputProps("street")}
          />
          <TextInput
            label="Číslo popisné"
            placeholder="1"
            {...form.getInputProps("descNo")}
          />
          <TextInput
            label="Číslo orientační"
            placeholder="1a"
            {...form.getInputProps("orientNo")}
          />
          <Text>Zeměpisné souřadnice</Text>
          <Box>
            <Button
              onClick={async (e) => {
                await fetch(`/api/locations/geo`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    country: form.values.country,
                    municipality: form.values.municipality ?? "",
                    street: form.values.street ?? null,
                    descNumber: Number(form.values.descNo) ?? null,
                    orientNumber: form.values.orientNo
                      ? String(form.values.orientNo)
                      : null,
                  }),
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                    return response.json();
                  })
                  .then((result) => {
                    //console.log(result);
                    notifications.show({
                      title: "Povedlo se!",
                      message:
                        "Geokódování bylo úspěšné: " +
                        result.lat +
                        ", " +
                        result.lon +
                        ".",
                      color: "lime",
                    });
                    form.setValues({
                      latitude: Number(result.lat) || undefined,
                      longitude: Number(result.lon) || undefined,
                    });
                  })
                  .catch((error) => {
                    notifications.show({
                      title: "Chyba!",
                      message: "Geokódování se nepodařilo.",
                      color: "red",
                    });
                  });
              }}
            >
              Najít souřadnice
            </Button>
          </Box>
          <NumberInput
            label="Zeměpisná šířka"
            placeholder="50.1234567"
            {...form.getInputProps("latitude")}
          />
          <NumberInput
            label="Zeměpisná délka"
            placeholder="15.1234567"
            {...form.getInputProps("longitude")}
          />
          <Group justify="flex-start" mt="md">
            <Button type="submit">Vytvořit</Button>
            <Button
              component={Link}
              href="/dashboard/locations"
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
