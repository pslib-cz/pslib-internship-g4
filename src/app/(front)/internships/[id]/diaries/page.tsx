"use client";

import React, { useState, useEffect, Suspense, FC, useCallback } from "react";
import {
  Title,
  Box,
  Text,
  Alert,
  Breadcrumbs,
  Anchor,
  LoadingOverlay,
  Container,
} from "@mantine/core";
import { Internship, Diary } from "@prisma/client";
import {
  InternshipWithCompanyLocationSetUser,
} from "@/types/entities";
import Link from "next/link";

const Page = ({ params }: { params: { id: number } }) => {
  const id = params.id;
  const [internship, setInternship] = useState<Internship | null>(null);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const loadInternship = useCallback(() => {
    fetch(`/api/internships/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 404) {
          setInternship(null);
          setDiaries([]);
          throw new Error("Taková praxe neexistuje");
        }
        if (!response.ok) {
          setData(null);
          setError("Došlo k chybě při získávání dat.");
          throw new Error("Nepodařilo se načíst data praxe");
        }
        return response.json();
      })
      .then((data) => {
        setInternship(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {});
  }, []);
  const [data, setData] = useState<InternshipWithCompanyLocationSetUser | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    loadInternship();
  }, [loadInternship]);

  if (error) {
    return <Alert color="red">{error}</Alert>;
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
        <Anchor component={Link} href="/internships">
          Praxe
        </Anchor>
        <Text>Deník</Text>
      </Breadcrumbs>
      <Container>
        {error ? (
          <Alert color="red">{error}</Alert>
        ) : (
          <>
            <Title order={1}>Deník praxe</Title>
          </>
        )}
      </Container>
    </>
  );
};
export default Page;
