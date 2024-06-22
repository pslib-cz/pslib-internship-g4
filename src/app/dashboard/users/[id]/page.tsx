"use client";

import React, { useState, useEffect } from "react";
import {
  Title,
  Box,
  LoadingOverlay,
  SimpleGrid,
  Card,
  Text,
  Alert,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import { RoleBadge } from "@/components";
import { User } from "@prisma/client";
import Link from "next/link";

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
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
        setUser(data);
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
      <Alert color="red" title="Chyba při načítání uživatele">
        {error.message}
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
        <Text>Detail</Text>
      </Breadcrumbs>
      <Title order={2}>Informace o uživateli</Title>
      <Box>
        <LoadingOverlay visible={loading} />
        <SimpleGrid cols={2} spacing="lg">
          {user && (
            <Card shadow="sm" padding="lg">
              <Title order={3}>Osobní údaje</Title>
              <Text fw={700}>ID</Text>
              <Text>{user.id}</Text>
              <Text fw={700}>Jméno a příjmení</Text>
              <Text>
                {user.givenName} {user?.surname}
              </Text>
              <Text fw={700}>Datum narození</Text>
              <Text>
                {user.birthDate === null
                  ? "?"
                  : new Date(user.birthDate).toLocaleDateString("cz")}
              </Text>
              <Text fw={700}>Role</Text>
              <RoleBadge role={user.role} />
              <Text fw={700}>Třída</Text>
              <Text>{user.department ?? "?"}</Text>
            </Card>
          )}
          <Card shadow="sm" padding="lg">
            <Title order={3}>Kontaktní údaje</Title>
            <Text fw={700}>Ulice č.p./č.o.</Text>
            <Text>
              {user?.street ?? "?"} {user?.descNo ?? "?"}/
              {user?.orientNo ?? "?"}
            </Text>
            <Text fw={700}>Obec</Text>
            <Text>{user?.municipality ?? "?"}</Text>
            <Text fw={700}>PSČ</Text>
            <Text>{user?.postalCode ?? "?"}</Text>
            <Text fw={700}>Email</Text>
            <Anchor href={"mailto:" + user?.email}>{user?.email}</Anchor>
            <Text fw={700}>Telefon</Text>
            <Anchor href={"tel:" + user?.phone}>{user?.phone}</Anchor>
          </Card>
        </SimpleGrid>
      </Box>
    </>
  );
};
export default Page;
