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
import { Set } from "@prisma/client";
import Link from "next/link";
import { DateTime } from "@/components";

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [set, setSet] = useState<Set | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    setLoading(true);
    fetch(`/api/sets/${id}`, {
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
        setSet(data);
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
      <Alert color="red" title="Chyba při načítání šablony">
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
        <Anchor component={Link} href="/dashboard/sets">
          Sady
        </Anchor>
        <Text>Detail</Text>
      </Breadcrumbs>
      <Title order={2}>Informace o sadě prací</Title>
      <Box>
        <LoadingOverlay visible={loading} />
        <SimpleGrid cols={2} spacing="lg">
          {set && (
            <Card shadow="sm" padding="lg">
              <Title order={3}>Základní údaje</Title>
              <Text fw={700}>ID</Text>
              <Text>{set.id}</Text>
              <Text fw={700}>Název</Text>
              <Text>{set.name}</Text>
              <Text fw={700}>Rok</Text>
              <Text>{set.year}</Text>
              <Text fw={700}>Aktivní</Text>
              <Text>{set.active ? "Ano" : "Ne"}</Text>
              <Text fw={700}>Průběžná</Text>
              <Text>{set.continuous ? "Ano" : "Ne"}</Text>
              <Text fw={700}>Editovatelné práce</Text>
              <Text>{set.editable ? "Ano" : "Ne"}</Text>
            </Card>
          )}
          {set && (
            <Card shadow="sm" padding="lg">
              <Title order={3}>Termíny</Title>
              <Text fw={700}>Začátek</Text>
              <Text>{<DateTime date={set.start} locale="cs" />}</Text>
              <Text fw={700}>Konec</Text>
              <Text>{<DateTime date={set.end} locale="cs" />}</Text>
              <Text fw={700}>Počet dní</Text>
              <Text>{set.daysTotal}</Text>
              <Text fw={700}>Počet hodin denně</Text>
              <Text>{set.hoursDaily}</Text>
            </Card>
          )}
          {set && (
            <Card shadow="sm" padding="lg">
              <Title order={3}>Škola</Title>
              <Text fw={700}>Název</Text>
              <Text>{set.schoolName}</Text>
              <Text fw={700}>Zástupce školy</Text>
              <Text>{set.representativeName}</Text>
              <Text fw={700}>Email zástupce školy</Text>
              <Text>{set.representativeEmail ?? "není"}</Text>
              <Text fw={700}>Telefon zástupce školy</Text>
              <Text>{set.representativePhone ?? "není"}</Text>
            </Card>
          )}
        </SimpleGrid>
      </Box>
    </>
  );
};
export default Page;
