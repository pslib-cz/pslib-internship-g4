"use client";

import { Drawer } from "@mantine/core";
import { AccountDrawerContext } from "@/providers/AccountDrawerProvider";
import {
  TextInput,
  Button,
  Group,
  ScrollArea,
  LoadingOverlay,
  NativeSelect,
  Title,
} from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import "dayjs/locale/cs";

export const AccountDrawer = () => {
  const { opened, close, open, pageSize, setPageSize, pageSizeOptions } =
    useContext(AccountDrawerContext);
  const [loading, setLoading] = useState(true);
  const form = useForm({
    initialValues: {
      givenName: "",
      surname: "",
      email: "",
      department: "",
      birthDate: null,
      phone: null,
      street: "",
      descNo: null,
      orientNo: null,
      municipality: "",
      postalCode: null,
    },
    validate: {
      givenName: (value) =>
        value && value.trim() !== "" ? null : "Jméno je povinné",
      surname: (value) => (value.trim() !== "" ? null : "Příjmení je povinné"),
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Neplatný formát emailu",
    },
  });
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/account");
      if (!response.ok) {
        if (response.status === 401) {
          return;
        }
        throw new Error("Nepodařilo se načíst osobní data.");
      }
      const data = await response.json();
      form.setValues({
        givenName: data.givenName || "",
        surname: data.surname || "",
        email: data.email || "",
        department: data.department || null,
        birthDate: data.birthDate || null,
        phone: data.phone || null,
        street: data.street || null,
        descNo: data.descNo || null,
        orientNo: data.orientNo || null,
        municipality: data.municipality || null,
        postalCode: data.postalCode || null,
      });
    } catch (error: Error | any) {
      console.error(error);
      notifications.show({
        title: "Stala se chyba!",
        message: error.message || "Nepodařilo se načíst osobní data.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Drawer
      opened={opened}
      onClose={close}
      padding="md"
      title="Uživatelský účet"
      zIndex={500}
      position="right"
    >
      <LoadingOverlay visible={loading} />
      <ScrollArea>
        <Title order={2}>Osobní údaje</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            setLoading(true);
            fetch("/api/account", {
              method: "PUT",
              body: JSON.stringify(values),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Nepodařilo se uložit osobní data.");
                }
                return response.json();
              })
              .then((data) => {
                form.setValues({
                  givenName: data.givenName || "",
                  surname: data.surname || "",
                  email: data.email || "",
                  department: data.department || "",
                  birthDate: data.birthDate || null,
                  phone: data.phone || "",
                  street: data.street || null,
                  descNo: data.descNo || null,
                  orientNo: data.orientNo || null,
                  municipality: data.municipality || null,
                  postalCode: data.postalCode || null,
                });
                notifications.show({
                  title: "Povedlo se!",
                  message: "Osobní data byla uložena.",
                  color: "lime",
                });
              })
              .catch((error) => {
                notifications.show({
                  title: "Stala se chyba!",
                  message: error.message || "Nepodařilo se uložit osobní data.",
                  color: "red",
                });
              })
              .finally(() => {
                setLoading(false);
              });
          })}
        >
          <TextInput
            withAsterisk
            label="Jméno"
            placeholder="Květomil"
            {...form.getInputProps("givenName")}
          />
          <TextInput
            withAsterisk
            label="Příjmení"
            placeholder="Vomáčka"
            {...form.getInputProps("surname")}
          />
          <TextInput
            withAsterisk
            label="Email"
            placeholder="name@email.com"
            {...form.getInputProps("email")}
          />
          <TextInput
            label="Třída"
            placeholder="x"
            {...form.getInputProps("department")}
          />
          <TextInput
            pos="relative"
            label="Datum narození"
            type="date"
            {...form.getInputProps("birthDate")}
          />
          <TextInput
            label="Telefon"
            type="tel"
            placeholder=""
            {...form.getInputProps("phone")}
          />
          <TextInput
            label="Ulice"
            placeholder=""
            {...form.getInputProps("street")}
          />
          <TextInput
            label="Číslo popisné"
            placeholder=""
            {...form.getInputProps("descNo")}
          />
          <TextInput
            label="Číslo orientační"
            placeholder=""
            {...form.getInputProps("orientNo")}
          />
          <TextInput
            label="Obec"
            placeholder=""
            {...form.getInputProps("municipality")}
          />
          <TextInput
            label="PSČ"
            placeholder=""
            {...form.getInputProps("postalCode")}
          />
          <Group justify="flex-start" mt="md">
            <Button type="submit">Uložit</Button>
            <Button variant="default" onClick={close}>
              Storno
            </Button>
          </Group>
        </form>
        <Title order={2} mt="sm">
          Nastavení
        </Title>
        <NativeSelect
          label="Počet položek na stránku"
          data={pageSizeOptions.map((value) => value.toString())}
          value={pageSize.toString()}
          onChange={(event) => setPageSize(parseInt(event.currentTarget.value))}
        />
      </ScrollArea>
    </Drawer>
  );
};

export default AccountDrawer;
