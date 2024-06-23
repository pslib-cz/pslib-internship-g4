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
import { Location } from "@prisma/client";
import Coordinates from "@/components/Coordinates/Coordinates";
import Link from "next/link";

const Page = ({ params }: { params: { id: number } }) => {
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Location | null>(null);
  const [error, setError] = useState<Error | null>(null);
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
        throw new Error("Nepodařilo se načíst místa");
      })
      .then((data) => {
        setData(data);
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
      <Alert color="red" title="Chyba při načítání míst.">
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
        <Anchor component={Link} href="/dashboard/locations">
          Místa
        </Anchor>
        <Text>Detail</Text>
      </Breadcrumbs>
      <Title order={2}>Informace o místě</Title>
      <Box>
        <LoadingOverlay visible={loading} />
        <SimpleGrid cols={2} spacing="lg">
          {data && (
            <Card shadow="sm" padding="lg">
              <Title order={3}>Místopisná data</Title>
              <Text fw={700}>ID</Text>
              <Text>{data.id}</Text>
              <Text fw={700}>Ulice</Text>
              <Text>{data.street ?? "?"}</Text>
              <Text fw={700}>Č.p./Č.o.</Text>
              <Text>
                {data.descNo ?? "?"} / {data.orientNo ?? "?"}
              </Text>
              <Text fw={700}>Obec</Text>
              <Text>{data.municipality ?? "?"}</Text>
              <Text fw={700}>PSČ</Text>
              <Text>{data.postalCode ?? "?"}</Text>
              <Text fw={700}>Stát</Text>
              <Text>{data.country ?? "?"}</Text>
              <Text fw={700}>Souřadnice</Text>
              <Text>
                <Coordinates
                  latitude={data.latitude}
                  longitude={data.longitude}
                />
              </Text>
            </Card>
          )}
        </SimpleGrid>
      </Box>
    </>
  );
};
export default Page;
