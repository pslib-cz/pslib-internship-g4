"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
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
  NumberInput,
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
        if (value < 0 && value > 99999)
          return "PSČ musí být v rozmezí 00000 - 99999";
        return null;
      },
    },
  });
  useEffect(() => {
    setLoading(true);
    fetch(`/api/locations/${id}`, {
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
          country: data.country,
          municipality: data.municipality,
          postalCode: data.postalCode,
          street: data.street,
          descNo: data.descNo,
          orientNo: data.orientNo,
          latitude: data.latitude,
          longitude: data.longitude,
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
      <Alert color="red" title="Chyba při načítání nebo ukládání místa">
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
        <Anchor component={Link} href="/dashboard/locations">
          Místa
        </Anchor>
        <Text>Editace</Text>
      </Breadcrumbs>
      <Container>
        <LoadingOverlay visible={loading} />
        <Title order={2}>Editace místa</Title>
        <form
          onSubmit={form.onSubmit(
            (values: {
              country: string;
              municipality: string | undefined;
              postalCode: number | undefined;
              street: string | undefined;
              descNo: number | undefined;
              orientNo: string | undefined;
              latitude: number | undefined;
              longitude: number | undefined;
            }) => {
              setLoading(true);
              fetch(`/api/locations/${id}`, {
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
                  router.push("/dashboard/locations", { scroll: false });
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
            withAsterisk
            label="Obec"
            placeholder="Ljósálfheimr"
            {...form.getInputProps("municipality")}
          />
          <NumberInput
            withAsterisk
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
                    descNumber: form.values.descNo ?? null,
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
                  .then(
                    (result: {
                      lat: number | undefined;
                      lon: number | undefined;
                    }) => {
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
                    },
                  )
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
            placeholder="15.1234567"
            {...form.getInputProps("latitude")}
          />
          <NumberInput
            label="Zeměpisná délka"
            placeholder="50.1234567"
            {...form.getInputProps("longitude")}
          />
          <Group justify="flex-start" mt="md">
            <Button type="submit">Uložit</Button>
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
