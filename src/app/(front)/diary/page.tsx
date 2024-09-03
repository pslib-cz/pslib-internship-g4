"use client";

import React from "react";
import { Title, Text, Breadcrumbs, Anchor, Container } from "@mantine/core";
import Link from "next/link";

const Page = ({ params }: { params: { id: number } }) => {
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/">
          Titulní stránka
        </Anchor>
        <Text>Deníky</Text>
      </Breadcrumbs>
      <Container>
        <Title order={1}>Deníky</Title>
        <Text>Seznam deníků není veřejně dostupný.</Text>
      </Container>
    </>
  );
};
export default Page;
