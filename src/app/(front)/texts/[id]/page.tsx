"use client";

import React, { useState, useEffect } from "react";
import {
  Title,
  Box,
  Text,
  Alert,
  Breadcrumbs,
  Anchor,
  LoadingOverlay,
  Card,
  Container,
} from "@mantine/core";
import { TextWithAuthor } from "@/types/entities";
import Link from "next/link";

const Page = ({ params }: { params: { id: number } }) => {
  const id = params.id;
  const [data, setData] = useState<TextWithAuthor | null>(null);
  const [error, setError] = useState<Error | null>(null);
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
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error: Error) => {
        setError(error);
      })
      .finally(() => {});
  }, [id]);

  if (error) {
    return <Alert color="red">{error.message}</Alert>;
  }
  if (!data) {
    return <LoadingOverlay />;
  }
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/">
          Titulní stránka
        </Anchor>
        <Anchor component={Link} href="/texts">
          Texty
        </Anchor>
        <Text>Detail</Text>
      </Breadcrumbs>
      <Container>
        <Title order={1}>{data.title}</Title>
        <Box dangerouslySetInnerHTML={{ __html: data.content ?? "" }} />
      </Container>
    </>
  );
};
export default Page;
