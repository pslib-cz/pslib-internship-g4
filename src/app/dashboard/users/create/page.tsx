"use client";

import React from "react";
import { Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  TextInput,
  Button,
  Group,
  Container,
  NativeSelect,
  Anchor,
  Breadcrumbs,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { Role } from "../../../../types/auth";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      givenName: "",
      surname: "",
      email: "",
      department: "",
      role: Role.GUEST,
      birthDate: undefined,
      phone: "",
      street: "",
      descNo: "",
      orientNo: "",
      municipality: "",
      postalCode: "",
    },
    validate: {
      givenName: (value) => (value.trim() !== "" ? null : "Jméno je povinné"),
      surname: (value) => (value.trim() !== "" ? null : "Příjmení je povinné"),
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Neplatný formát emailu",
      role: (value) =>
        Object.values(Role).includes(value) ? null : "Neplatná role",
    },
  });
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Anchor component={Link} href="/dashboard/users">
          Uživatelé
        </Anchor>
        <Text>Nový</Text>
      </Breadcrumbs>
      <Container>
        <Title order={2}>Nový uživatel</Title>
        <form
          onSubmit={form.onSubmit(
            (values: {
              givenName: string;
              surname: string;
              email: string;
              department: string | undefined;
              birthDate: Date | undefined;
              phone: string | undefined;
              street: string | undefined;
              descNo: string | undefined;
              orientNo: string | undefined;
              municipality: string | undefined;
              postalCode: string | undefined;
              role: Role;
            }) => {
              fetch("/api/users", {
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
                    message: "Uživatel byl vytvořen.",
                    color: "lime",
                  });
                  router.push("/dashboard/users", { scroll: false });
                })
                .catch((error) => {
                  notifications.show({
                    title: "Chyba!",
                    message: "Nepodařilo se vytvořit uživatele.",
                    color: "red",
                  });
                });
            },
          )}
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
          <NativeSelect
            withAsterisk
            label="Role"
            data={[
              { label: "Host", value: Role.GUEST },
              { label: "Student", value: Role.STUDENT },
              { label: "Učitel", value: Role.TEACHER },
              { label: "Administrátor", value: Role.ADMIN },
            ]}
            {...form.getInputProps("role")}
          />
          <TextInput
            label="Datum narození"
            placeholder=""
            type="date"
            {...form.getInputProps("birthDate")}
          />
          <TextInput
            label="Telefon"
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
            <Button type="submit">Vytvořit</Button>
            <Button component={Link} href="/dashboard/users" variant="default">
              Storno
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
};

export default Page;
