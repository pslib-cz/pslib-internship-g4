"use client";

import Link from "next/link";
import React, { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Text,
  Anchor,
  Breadcrumbs,
  Title,
  Alert,
  Loader,
  Card,
  Grid,
  Container,
} from "@mantine/core";
import { CompanyBranchWithLocation } from "../../../api/companies/[id]/locations/route";
import { CompanyWithLocation } from "@/types/entities";
import Address from "@/components/Address/Address";
import { useMediaQuery } from "@mantine/hooks";
import BranchesSwitch from "./BranchesSwitch";
import Coordinates from "@/components/Coordinates/Coordinates";
const CompaniesTags = React.lazy(
  () => import("@/components/CompaniesTags/CompaniesTags"),
);

const DataDisplay = ({ id }: { id: number }) => {
  const [company, setCompany] = useState<CompanyWithLocation | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    fetch(`/api/companies/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.status === 404) {
          throw new Error("Taková firma neexistuje");
        }
        if (response.ok) {
          return response.json();
        }
        throw new Error("Nepodařilo se načíst firmu");
      })
      .then((data) => {
        setCompany(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, [id]);
  if (error) {
    return (
      <Alert color="red" title="Chyba">
        {error.message}
      </Alert>
    );
  }
  return (
    <>
      <Title order={2}>{company?.name}</Title>
      <Text fw={700}>IČO</Text>
      <Text>
        {company?.companyIdentificationNumber
          ? String(company?.companyIdentificationNumber).padStart(8, "0")
          : "neznámé"}
      </Text>
      {company?.website && (
        <>
          <Text fw={700}>Webová stránka</Text>
          <Anchor href={company?.website}>{company?.website ?? ""}</Anchor>
        </>
      )}
      {company?.description && (
        <>
          <Text fw={700}>Popis</Text>
          <Box
            dangerouslySetInnerHTML={{ __html: company?.description ?? "" }}
          />
        </>
      )}
      {company?.location && (
        <>
          <Text fw={700}>Adresa</Text>
          <Address
            street={company?.location.street}
            descNum={company?.location.descNo}
            orientNum={company?.location.orientNo}
            municipality={company?.location.municipality ?? ""}
            postalCode={company?.location.postalCode}
            country={company?.location.country ?? "Česká Republika"}
          />
          <Text fw={700}>Souřadnice</Text>
          <Text>
            <Coordinates
              latitude={company?.location.latitude}
              longitude={company?.location.longitude}
            />
          </Text>
        </>
      )}
      {company?.companyIdentificationNumber && (
        <>
          <Text fw={700}>Další informace</Text>
          <Text>
            <Anchor
              underline="always"
              href={
                "https://ares.gov.cz/ekonomicke-subjekty?ico=" +
                String(company?.companyIdentificationNumber).padStart(8, "0")
              }
              target="_blank"
            >
              ARES
            </Anchor>{" "}
            <Anchor
              underline="always"
              href={
                "https://rejstrik-firem.kurzy.cz/" +
                String(company?.companyIdentificationNumber).padStart(8, "0")
              }
              target="_blank"
            >
              Kurzy.cz
            </Anchor>{" "}
          </Text>
        </>
      )}
    </>
  );
};

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;

  const mobile = useMediaQuery("(max-width: 640px)");
  const { data: session } = useSession();
  return (
    <>
      <Breadcrumbs separatorMargin="md" my="xs">
        <Anchor component={Link} href="/">
          Titulní stránka
        </Anchor>
        <Anchor component={Link} href="/companies">
          Firmy
        </Anchor>
        <Text>Detail</Text>
      </Breadcrumbs>
      <Container>
        <Title order={2}>Detail firmy</Title>
        <Grid justify="flex-start" align="stretch">
          <Grid.Col span={mobile ? 12 : 6}>
            <Card shadow="xs" p="xl" h="100%">
              <Suspense fallback={<Loader />}>
                <DataDisplay id={Number(id)} />
              </Suspense>
            </Card>
          </Grid.Col>
          <Grid.Col span={mobile ? 12 : 6}>
            <Card shadow="xs" p="xl" h="100%">
              <Title order={2} mb="sm">
                Značky
              </Title>
              <Suspense fallback={<Loader />}>
                <CompaniesTags
                  companyId={Number(id)}
                  editable={session !== null}
                />
              </Suspense>
            </Card>
          </Grid.Col>
          <Grid.Col span={12}>
            <Card shadow="xs" p="xl" h="100%">
              <Title order={2}>Pobočky a místa praxí</Title>
              <BranchesSwitch id={Number(id)} />
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
};

export default Page;
