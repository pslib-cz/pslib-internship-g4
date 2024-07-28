"use client";

import React from "react";
import { notifications } from "@mantine/notifications";
import { TextInput, Button, Group, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";

const BranchesAdd = ({
  closeAction,
  companyId,
}: {
  closeAction: () => void;
  companyId: number;
}) => {
  const form = useForm<{
    name: string;
    country: string;
    municipality: string;
    street: string;
    descNo: number | undefined;
    orientNo: string;
    postalCode: number | undefined;
  }>({
    initialValues: {
      name: "",
      country: "Česko",
      municipality: "Liberec",
      street: "",
      descNo: undefined,
      orientNo: "",
      postalCode: undefined,
    },
    validate: {
      country: (value) =>
        value.trim() !== "" ? null : "Stát musí být vyplněn",
      municipality: (value) =>
        value.trim() !== "" ? null : "Obec musí být vyplněna",
      descNo: (value) => (value ? null : "Číslo popisné musí být vyplněno"),
      postalCode: (value) => {
        if (!value) return "PSČ musí být vyplněno";
        if (value < 10000 || value > 99999) return "PSČ musí mít 5 číslic";
        return null;
      },
    },
  });
  return (
    <form
      onSubmit={form.onSubmit(
        (values: {
          name: string;
          country: string;
          municipality: string;
          street: string;
          descNo: number | undefined;
          orientNo: string;
          postalCode: number | undefined;
        }) => {
          let latitude: number | undefined = undefined;
          let longitude: number | undefined = undefined;
          fetch(`/api/locations/geo`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              country: values.country,
              municipality: values.municipality,
              street: values.street ?? undefined,
              descNumber: values.descNo ?? undefined,
              orientNumber: String(values.orientNo) ?? undefined,
              postalCode: values.postalCode ?? undefined,
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
                latitude = Number(result.lat) || undefined;
                longitude = Number(result.lon) || undefined;
                notifications.show({
                  title: "Povedlo se!",
                  message:
                    "Geokódování bylo úspěšné: " +
                    latitude +
                    ", " +
                    longitude +
                    ".",
                  color: "lime",
                });
              },
            )
            .catch((error) => {
              notifications.show({
                title: "Chyba!",
                message: "Geokódování se nepodařilo.",
                color: "red",
              });
            })
            .finally(() => {
              console.log(latitude, longitude);
              fetch(`/api/locations`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  country: values.country,
                  municipality: values.municipality,
                  postalCode: values.postalCode,
                  street: values.street ?? "",
                  orientNo: values.orientNo ?? "",
                  descNo: values.descNo,
                  latitude: latitude,
                  longitude: longitude,
                }),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Chyba při přidávání adresy do databáze.");
                  }
                  return response.json();
                })
                .then((data) => {
                  console.log(data);
                  notifications.show({
                    title: "Povedlo se!",
                    message: `Místo ${data.id} bylo vytvořeno nebo nalezeno.`,
                    color: "lime",
                  });
                  fetch(`/api/companies/${companyId}/locations`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      companyId: companyId,
                      locationId: data.id,
                      name: values.name,
                    }),
                  })
                    .then((response) => {
                      if (response.ok) {
                        return response.json();
                      }
                      throw new Error("Došlo k chybě během vytváření pobočky.");
                    })
                    .then((result) => {
                      console.log(result);
                      closeAction();
                    })
                    .catch((error) => {
                      notifications.show({
                        title: "Chyba!",
                        message: "Pobočku se nepodařilo vytvořit nebo najít.",
                        color: "red",
                      });
                    });
                })
                .catch((error) => {
                  notifications.show({
                    title: "Chyba!",
                    message: "Místo se nepodařilo vytvořit nebo najít.",
                    color: "red",
                  });
                });
            });
        },
      )}
    >
      <TextInput
        label="Název pobočky"
        placeholder="Pobočka Ljósálfheimr"
        {...form.getInputProps("name")}
      />
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
      <TextInput
        label="Ulice"
        placeholder="Bifröst"
        {...form.getInputProps("street")}
      />
      <NumberInput
        withAsterisk
        label="Číslo popisné"
        placeholder="42"
        {...form.getInputProps("descNo")}
      />
      <TextInput
        label="Číslo orientační"
        placeholder="1a"
        {...form.getInputProps("orientNo")}
      />
      <NumberInput
        withAsterisk
        label="PSČ"
        placeholder="00000"
        {...form.getInputProps("postalCode")}
      />
      <Group justify="flex-start" mt="md">
        <Button type="submit">Přidat</Button>
        <Button variant="default" onClick={closeAction}>
          Zrušit
        </Button>
      </Group>
    </form>
  );
};

export default BranchesAdd;
