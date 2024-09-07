"use client";

import React, { useEffect, useState, Suspense } from "react";
import {
  Container,
  Anchor,
  Breadcrumbs,
  Text,
  LoadingOverlay,
  Title,
} from "@mantine/core";
import Link from "next/link";

import CreateInternshipForm from "./CreateInternshipForm";

const Page = () => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/">
          Titulní stránka
        </Anchor>
        <Anchor component={Link} href="/internships">
          Praxe
        </Anchor>
        <Text>Nová</Text>
      </Breadcrumbs>
      <LoadingOverlay visible={loading} />
      <Container>
        <Title order={2}>Nová praxe</Title>
        <Suspense fallback={<LoadingOverlay />}>
          <CreateInternshipForm />
        </Suspense>
      </Container>
    </>
  );
};

export default Page;
