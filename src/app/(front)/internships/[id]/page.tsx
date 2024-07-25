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
import { InternshipWithCompanyLocationSetUser } from "@/types/entities";
import DateTime from "@/components/DateTime/DateTime";
import Link from "next/link";
import { getInternshipKindLabel } from "@/data/lists";

const Page = ({ params }: { params: { id: number } }) => {
  const id = params.id;
  const [data, setData] = useState<InternshipWithCompanyLocationSetUser | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch(`/api/internships/${id}`, {
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
        <Anchor component={Link} href="/">
          Titulní stránka
        </Anchor>
        <Anchor component={Link} href="/internships">
          Praxe
        </Anchor>
        <Text>Detail</Text>
      </Breadcrumbs>
      <SimpleGrid cols={2} spacing="lg">
        <Suspense fallback={<LoadingOverlay />}></Suspense>
        <Suspense fallback={<LoadingOverlay />}></Suspense>
        <Suspense fallback={<LoadingOverlay />}></Suspense>
        <Suspense fallback={<LoadingOverlay />}></Suspense>
        <Suspense fallback={<LoadingOverlay />}></Suspense>
      </SimpleGrid>
      <pre>{JSON.stringify(data, (k, v) => v, 4)}</pre>
    </>
  );
};
export default Page;
