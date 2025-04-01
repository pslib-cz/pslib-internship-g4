"use client";

import React from "react";
import {
  InspectionWithInspectorAndInternship,
  InternshipFullRecord,
} from "@/types/entities";
import { Title, Text, Anchor, Box } from "@mantine/core";
import Link from "next/link";
import Address from "@/components/Address/Address";

const CompanyDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <>
      <Title order={2}>Firma</Title>
      <Text fw={700}>Název</Text>
      <Text>{data.company.name}</Text>
      <Text fw={700}>Adresa</Text>
      <Text>
        <Address
          municipality={data.company.location?.municipality ?? ""}
          street={data.company.location?.street ?? "?"}
          descNum={data.company.location?.descNo}
          orientNum={data.company.location?.orientNo}
          country=""
          postalCode={data.company.location?.postalCode}
        />
      </Text>
      {data.company.description ? (
        <>
          <Text fw={700}>Popis</Text>
          <Box
            dangerouslySetInnerHTML={{ __html: data.company.description ?? "" }}
          />
        </>
      ) : null}
      {data.company.website ? (
        <>
          <Text fw={700}>Webové stránky</Text>
          <Text>
            <Anchor
              component={Link}
              href={data.company.website}
              target="_blank"
            >
              {data.company.website}
            </Anchor>
          </Text>
        </>
      ) : null}
    </>
  );
};

export default CompanyDisplay;
