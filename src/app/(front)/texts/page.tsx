"use client";

import Link from "next/link";
import {
  Title,
  Container,
  Breadcrumbs,
  Anchor,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import TextsTable from "./TextsTable";
import { Suspense } from "react";

const Page = () => {
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/">
          Titulní stránka
        </Anchor>
        <Text>Texty</Text>
      </Breadcrumbs>
      <Container>
        <Title order={2}>Texty</Title>
        <Suspense fallback={<LoadingOverlay />}>
          <TextsTable />
        </Suspense>
      </Container>
    </>
  );
};

export default Page;
