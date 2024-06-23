"use client";

import React, { useState, useEffect } from "react";
import {
  Title,
  Box,
  LoadingOverlay,
  Text,
  Alert,
  Breadcrumbs,
  Anchor,
  Container,
  TextInput,
  Button,
  Group,
  NativeSelect,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Role } from "@/types/auth";

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      givenName: "",
      surname: "",
      email: "",
      department: undefined,
      birthDate: undefined,
      phone: undefined,
      street: undefined,
      descNo: undefined,
      orientNo: undefined,
      municipality: undefined,
      postalCode: undefined,
      role: Role.GUEST,
    },
    validate: {
      givenName: (value) => (value !== undefined ? null : "Jméno je povinné"),
      surname: (value) => (value !== undefined ? null : "Příjmení je povinné"),
      email: (value) =>
        value !== undefined || /^\S+@\S+$/.test(value ?? "")
          ? null
          : "Neplatný formát emailu",
      role: (value) =>
        Object.values(Role).includes(value) ? null : "Neplatná role",
    },
  });
  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Nepodařilo se načíst uživatele");
      })
      .then((data) => {
        data.birthDate = data.birthDate
          ? new Date(data.birthDate).toISOString().split("T")[0]
          : undefined;
        form.setValues({
          givenName: data.givenName || undefined,
          surname: data.surname || undefined,
          email: data.email || undefined,
          department: data.department || undefined,
          birthDate: data.birthDate || undefined,
          phone: data.phone || undefined,
          street: data.street || undefined,
          descNo: data.descNo || undefined,
          orientNo: data.orientNo || undefined,
          municipality: data.municipality || undefined,
          postalCode: data.postalCode || undefined,
          role: data.role || Role.GUEST,
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
      <Alert color="red" title="Chyba při načítání nebo ukládání uživatele">
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
        <Anchor component={Link} href="/dashboard/users">
          Uživatelé
        </Anchor>
        <Text>Editace</Text>
      </Breadcrumbs>
      <Container>
        <LoadingOverlay visible={loading} />
        <Title order={2}>Editace uživatele</Title>
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
              console.log(values);
              values.birthDate = values.birthDate
                ? new Date(values.birthDate)
                : undefined;
              setLoading(true);
              fetch(`/api/users/${id}`, {
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
                    message: "Osobní data byla uložena.",
                    color: "lime",
                  });
                  router.push("/dashboard/users", { scroll: false });
                })
                .catch((error) => {
                  notifications.show({
                    title: "Chyba!",
                    message: "Nepodařilo se uložit osobní data.",
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
            <Button type="submit">Uložit</Button>
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
