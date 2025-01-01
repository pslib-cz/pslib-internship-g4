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
import { getInspectionResultLabel, getInspectionTypeLabel } from "@/data/lists";

type InspectionRecord = {
  id: number;
  date: string;
  note: string;
  result: number;
  kind: number;
  inspectionUser: {
    id: string;
    givenName: string;
    surname: string;
    email: string;
    image: string;
  };
  internship: {
    id: string;
    classname: string;
    created: string;
    kind: number;
    highlighted: boolean;
    user: {
      id: string;
      givenName: string;
      surname: string;
      email: string;
      image: string;
    };
    company: {
      id: number;
      name: string;
      companyIdentificationNumber: number;
      locationId: number;
    };
  };
};

const InspectionDetails = ({ data }: { data: InspectionRecord }) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Detail kontroly</Title>
      <Text fw={700}>Datum kontroly</Text>
      <Text>{new Date(data.date).toLocaleDateString("cs-CZ")}</Text>
      <Text fw={700}>Výsledek</Text>
      <Text>{getInspectionResultLabel(String(data.result))}</Text>
      <Text fw={700}>Druh kontroly</Text>
      <Text>{getInspectionTypeLabel(String(data.kind))}</Text>
      <Text fw={700}>Poznámka</Text>
      <Box dangerouslySetInnerHTML={{ __html: data.note }} />
      <Text fw={700}>Kontrolér</Text>
      <Text>
        <Anchor component={Link} href={`/dashboard/users/${data.inspectionUser.id}`}>
          {data.inspectionUser.surname}, {data.inspectionUser.givenName}
        </Anchor>
      </Text>
      <Text fw={700}>Praxe</Text>
      <Text>
        <Anchor component={Link} href={`/dashboard/internships/${data.internship.id}`}>
          {data.internship.id} ({data.internship.classname})
        </Anchor>
      </Text>
      <Text fw={700}>Firma</Text>
      <Text>
        <Anchor component={Link} href={`/dashboard/companies/${data.internship.company.id}`}>
          {data.internship.company.name} ({data.internship.company.companyIdentificationNumber})
        </Anchor>
      </Text>
    </Card>
  );
};

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [data, setData] = useState<InspectionRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/inspections/${id}`, {
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
        <Anchor component={Link} href="/dashboard/inspections">
          Kontroly
        </Anchor>
        <Text>Detail</Text>
      </Breadcrumbs>
      <SimpleGrid cols={1} spacing="lg">
        <Suspense fallback={<LoadingOverlay />}>
          <InspectionDetails data={data} />
        </Suspense>
      </SimpleGrid>
    </>
  );
};

export default Page;