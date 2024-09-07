"use client";

import Link from "next/link";
import {
  ScrollArea,
  Title,
  Box,
  Button,
  Breadcrumbs,
  Anchor,
  Text,
} from "@mantine/core";
import InternshipsTable from "./InternshipsTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/">
          Titulní stránka
        </Anchor>
        <Text>Praxe</Text>
      </Breadcrumbs>
      <Title order={2}>Seznam praxí</Title>
      <ScrollArea type="auto">
        <InternshipsTable />
      </ScrollArea>
    </>
  );
};

export default Page;
