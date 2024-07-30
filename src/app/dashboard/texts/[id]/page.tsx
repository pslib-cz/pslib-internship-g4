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
  Loader,
} from "@mantine/core";
import { Text as TextEntity } from "@prisma/client";
import { TextWithAuthor } from "@/types/entities";
import DateTime from "@/components/DateTime/DateTime";
import Link from "next/link";
import { getPublicationTargetLabel } from "@/data/lists";

const DataDisplay = ({ data }: { data: TextWithAuthor }) => {
  const publishedLabel = getPublicationTargetLabel(String(data.published));
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>{data?.title}</Title>
      <Text fw={700}>Umístění</Text>
      <Text>{publishedLabel ?? "?"}</Text>
      <Text fw={700}>Priorita</Text>
      <Text>{Number(data.priority)}</Text>
      <Text fw={700}>Zkratitelný</Text>
      <Text>{data.shortable ? "Ano" : "Ne"}</Text>
      <Text fw={700}>Autor</Text>
      <Text>
        <Anchor component={Link} href={"/dashboard/users/" + data.creator.id}>
          {data.creator.givenName} {data.creator.surname}
        </Anchor>
      </Text>
      <Text fw={700}>Vytvořeno</Text>
      <Text>
        <DateTime date={data.created} locale="cs" />
      </Text>
      <Text fw={700}>Aktualizováno</Text>
      <Text>
        <DateTime date={data.updated} locale="cs" />
      </Text>
    </Card>
  );
};

const ContentDisplay = ({ data }: { data: TextWithAuthor }) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Obsah</Title>
      {data.content ? (
        <Box dangerouslySetInnerHTML={{ __html: data.content ?? "" }} />
      ) : (
        <Text>není</Text>
      )}
    </Card>
  );
};

const Page = ({ params }: { params: { id: number } }) => {
  const id = params.id;
  const [data, setData] = useState<TextWithAuthor | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch(`/api/texts/${id}`, {
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
    return <LoadingOverlay />;
  }
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Anchor component={Link} href="/dashboard/texts">
          Texty
        </Anchor>
        <Text>Detail</Text>
      </Breadcrumbs>
      <SimpleGrid cols={2} spacing="lg">
        <Suspense fallback={<LoadingOverlay />}>
          <DataDisplay data={data} />
        </Suspense>
        <Suspense fallback={<LoadingOverlay />}>
          <ContentDisplay data={data} />
        </Suspense>
      </SimpleGrid>
    </>
  );
};
export default Page;
