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
  SimpleGrid,
  Card, 
  Button,
  Group
} from "@mantine/core";
import { InternshipWithCompanyLocationSetUser, InternshipFullRecord } from "@/types/entities";
import DateTime from "@/components/DateTime/DateTime"
import Link from "next/link";
import { getInternshipKindLabel } from "@/data/lists";
import LocationPanel from "./LocationPanel";

const StudentDisplay: FC<InternshipFullRecord | InternshipWithCompanyLocationSetUser> = (internship) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Student</Title>
      <Text fw={700}>Jméno a příjmení</Text>
      <Text>{internship.user.givenName} {internship.user.surname}</Text>
      <Text fw={700}>Email</Text>
      <Text>{internship.user.email}</Text>
      <Text fw={700}>Třída</Text>
      <Text>{internship.classname}</Text>
    </Card>
  );
}

const SetDisplay: FC<InternshipFullRecord | InternshipWithCompanyLocationSetUser> = (internship) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Sada</Title>
      <Text fw={700}>Termín</Text>
      <Text><DateTime date={internship.set.start} locale="cs" /> &ndash; <DateTime date={internship.set.end} locale="cs" /></Text>
      <Text fw={700}>Počet dní</Text>
      <Text>{internship.set.daysTotal}</Text>
      <Text fw={700}>Počet hodin denně</Text>
      <Text>{internship.set.hoursDaily}</Text>
      <Text fw={700}>Druh</Text>
      <Text>{internship.set.continuous ? "Průběžná" : "Souvislá"}</Text>
      <Text fw={700}>Rok</Text>
      <Text>{internship.set.year}</Text>
    </Card>
  );
}

const CompanyDisplay: FC<InternshipFullRecord | InternshipWithCompanyLocationSetUser> = (internship) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Firma</Title>
      <Text fw={700}>Název</Text>
      <Text>{internship.company.name}</Text>
      <Text fw={700}>IČO</Text>
      <Text>{internship.company.companyIdentificationNumber ?? "není"}</Text>
      <Text fw={700}>Druh praxe</Text>
      <Text>{getInternshipKindLabel(String(internship.kind))}</Text>
    </Card>
  );
}

const FilesDisplay: FC<InternshipFullRecord | InternshipWithCompanyLocationSetUser> = (internship) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Smlouva o praxi</Title>
      <Box>
        <Group mt="1em">
      <Button onClick={e => {
        e.preventDefault();
        window.open(`/api/internships/${internship.id}/agreement`, "_blank");
      }} variant="default">.html</Button>
      </Group>
      </Box>     
    </Card>
  );
}

const Page = ({ params }: { params: { id: number } }) => {
  const id = params.id;
  const loadData = useCallback(() => {
    console.log("LOADING DATA");
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
  },[]);
  const [data, setData] = useState<InternshipWithCompanyLocationSetUser | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    loadData();
  }, [loadData]);

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
      <Container>
      <SimpleGrid cols={{base: 1, sm: 2}} spacing="lg">
        <Suspense fallback={<LoadingOverlay />}>
          <StudentDisplay {...data} />
        </Suspense>
        <Suspense fallback={<LoadingOverlay />}>
          <SetDisplay {...data} />
        </Suspense>
        <Suspense fallback={<LoadingOverlay />}>
          <CompanyDisplay {...data} />
        </Suspense>
        <Suspense fallback={<LoadingOverlay />}>
          <LocationPanel internship={data} reloadInternshipCallback={loadData}/>
        </Suspense>
        <Suspense fallback={<LoadingOverlay />}>
          <FilesDisplay {...data} />
        </Suspense>
      </SimpleGrid>
      </Container>
    </>
  );
};
export default Page;
