"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Title,
  Box,
  Text,
  Alert,
  Breadcrumbs,
  Anchor,
  LoadingOverlay,
  Card,
  SimpleGrid,
} from "@mantine/core";
import Link from "next/link";

type DiaryRecord = {
  id: string;
  internshipId: string;
  date: string;
  text: string;
  createdBy: {
    id: string;
    givenName: string;
    surname: string;
  };
};

const DiaryDetails = ({ data }: { data: DiaryRecord }) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Detail záznamu deníku</Title>
      <Text fw={700}>ID praxe</Text>
      <Text>
        <Anchor
          component={Link}
          href={`/dashboard/internships/${data.internshipId}`}
        >
          {data.internshipId}
        </Anchor>
      </Text>
      <Text fw={700}>Datum</Text>
      <Text>{new Date(data.date).toLocaleDateString("cs-CZ")}</Text>
      <Text fw={700}>Autor</Text>
      <Text>
        <Anchor component={Link} href={`/dashboard/users/${data.createdBy.id}`}>
          {data.createdBy.surname}, {data.createdBy.givenName}
        </Anchor>
      </Text>
      <Text fw={700}>Text záznamu</Text>
      <Box dangerouslySetInnerHTML={{ __html: data.text }} />
    </Card>
  );
};

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [data, setData] = useState<DiaryRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/diaries/${id}`, {
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
      });
  }, [id]);

  if (error) {
    return <Alert color="red">{error}</Alert>;
  }
  if (!data) {
    return <LoadingOverlay />;
  }
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Anchor component={Link} href="/dashboard/diaries">
          Deníky
        </Anchor>
        <Text>Detail</Text>
      </Breadcrumbs>
      <SimpleGrid cols={1} spacing="lg">
        <Suspense fallback={<LoadingOverlay />}>
          <DiaryDetails data={data} />
        </Suspense>
      </SimpleGrid>
    </>
  );
};

export default Page;
