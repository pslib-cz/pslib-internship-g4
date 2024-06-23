"use client";

import React, { useState, useEffect } from "react";
import {
  Title,
  Box,
  LoadingOverlay,
  Grid,
  Card,
  Text,
  Alert,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import { Template } from "@prisma/client";
import Link from "next/link";

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<Template | null>(null);
  const [error, setError] = useState<Error | null>(null);
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
        setTemplate(data);
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
        <Anchor component={Link} href="/dashboard/templates">
          Šablony
        </Anchor>
        <Text>Detail</Text>
      </Breadcrumbs>
      <Title order={2}>Informace o šabloně</Title>
      <Box>
        <LoadingOverlay visible={loading} />
        <Grid>
          <Grid.Col span={6}>
            {template && (
              <Card shadow="sm" padding="lg">
                <Title order={3}>Základní údaje</Title>
                <Text fw={700}>ID</Text>
                <Text>{template.id}</Text>
                <Text fw={700}>Název</Text>
                <Text>{template.name}</Text>
              </Card>
            )}
          </Grid.Col>
          <Grid.Col span={6}>
            {template && (
              <Card shadow="sm" padding="lg">
                <Title order={3}>Využití</Title>
              </Card>
            )}
          </Grid.Col>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg">
              <Title order={3}>Obsah</Title>
              <Text>{template?.content ?? "?"}</Text>
            </Card>
          </Grid.Col>
        </Grid>
      </Box>
    </>
  );
};
export default Page;
