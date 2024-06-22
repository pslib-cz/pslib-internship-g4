"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Title,
  Box,
  Badge,
  Text,
  Alert,
  Breadcrumbs,
  Anchor,
  Loader,
  Card,
} from "@mantine/core";
import { Tag } from "@prisma/client";
import Link from "next/link";
import { tagTypes } from "@/data/lists";

const DataDisplay = ({ id }: { id: number }) => {
  const [data, setData] = useState<Tag | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/tags/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          setData(null);
          setError("Došlo k chybě při získávání dat.");
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {});
  }, [id]);

  if (error) {
    return <Alert color="red">{error}</Alert>;
  }

  if (!data) {
    return <Loader />;
  }

  const tagTypeLabel = tagTypes.find((tag) => tag.value == String(data?.type));
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>{data?.text}</Title>
      <Text fw={700}>Typ</Text>
      <Text>{tagTypeLabel?.label ?? "?"}</Text>
      <Text fw={700}>Náhled značky</Text>
      <Box>
        <Badge c={data.color} bg={data.background}>
          {data.text}
        </Badge>
      </Box>
    </Card>
  );
};

const Page = ({ params }: { params: { id: number } }) => {
  const id = params.id;
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Anchor component={Link} href="/dashboard/tags">
          Značky
        </Anchor>
        <Text>Detail</Text>
      </Breadcrumbs>
      <Box my="sm">
        <Suspense fallback={<Loader />}>
          <DataDisplay id={Number(id)} />
        </Suspense>
      </Box>
    </>
  );
};
export default Page;
