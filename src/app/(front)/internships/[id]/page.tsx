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
import { useMediaQuery } from "@mantine/hooks";
import { InternshipFullRecord } from "@/types/entities";
import DateTime from "@/components/DateTime/DateTime";
import Link from "next/link";
import { getInternshipKindLabel } from "@/data/lists";
import Address from "@/components/Address/Address";
import SwitchInternshipState from "@/components/SwitchInternshipState/SwitchInternshipState";
import { AgreementDownload } from "@/components";
import CompanyDisplay from "@/components/InternshipCards/CompanyDisplay/CompanyDisplay";
import StudentDisplay from "@/components/InternshipCards/StudentDisplay/StudentDisplay";
import ContactsDisplay from "@/components/InternshipCards/ContactsDisplay/ContactsDisplay";

const DataDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={3}>Základní údaje</Title>
      <Text fw={700}>Student</Text>
      <Text>
        {data.user.surname}, {data.user.givenName}
      </Text>
      <Text fw={700}>Firma</Text>
      <Text>
        <Anchor component={Link} href={`/companies/${data.companyId}`}>
          {data.company.name}
        </Anchor>
      </Text>
      <Text fw={700}>Termín</Text>
      <Text>
        {<DateTime date={data.set.start} locale="cs" />} -{" "}
        {<DateTime date={data.set.end} locale="cs" />}
      </Text>
      <Text fw={700}>Sada</Text>
      <Text>{data.set.name}</Text>
      <Text fw={700}>Počet dní</Text>
      <Text>{data.set.daysTotal}</Text>
      <Text fw={700}>Hodiny denně</Text>
      <Text>{data.set.hoursDaily}</Text>
      <Text fw={700}>Druh</Text>
      <Text>{data.set.continuous ? "Průběžná" : "Souvislá"}</Text>
      <Text fw={700}>Způsob</Text>
      <Text>{getInternshipKindLabel(String(data.kind))}</Text>
    </Card>
  );
};

const InternshipDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={3}>Praxe</Title>
      <Text fw={700}>Popis</Text>
      {data.jobDescription ? (
        <Box dangerouslySetInnerHTML={{ __html: data.jobDescription ?? "" }} />
      ) : (
        <Text>není</Text>
      )}
      <Text fw={700}>Další informace k praxi</Text>
      {data.additionalInfo ? (
        <Box dangerouslySetInnerHTML={{ __html: data.additionalInfo ?? "" }} />
      ) : (
        <Text>není</Text>
      )}
      <Text fw={700}>Dodatky ke smlouvě</Text>
      {data.appendixText ? (
        <Box dangerouslySetInnerHTML={{ __html: data.appendixText ?? "" }} />
      ) : (
        <Text>není</Text>
      )}
    </Card>
  );
};

const LocationDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={3}>Místo</Title>
      <Text fw={700}>Adresa</Text>
      <Address
        country={data.location.country ?? ""}
        municipality={data.location.municipality ?? ""}
        street={data.location.street}
        postalCode={data.location.postalCode}
        descNum={data.location.descNo}
        orientNum={data.location.orientNo}
      />
    </Card>
  );
};

const InspectionsDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={3}>Nastavení kontrol</Title>
      <Text fw={700}>Důležitost provedení kontroly</Text>
      <Text>{data.highlighted ? "nutná" : "normální"}</Text>
      <Text fw={700}>Rezervováno</Text>
      {data.reservationUserId ? (
        <Text>
          {data.reservationUser?.surname}, {data.reservationUser?.givenName}
        </Text>
      ) : (
        <Text>není</Text>
      )}
    </Card>
  );
};

const StateDisplay = ({
  data,
  reloadData,
}: {
  data: InternshipFullRecord;
  reloadData: () => void;
}) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={3}>Stav</Title>
      <SwitchInternshipState internship={data} afterStateChange={reloadData} />
    </Card>
  );
};

const ConclusionDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <>
      <Title order={3}>Závěrečné hodnocení</Title>
      <div
        dangerouslySetInnerHTML={{
          __html: data.conclusion ?? "Žádná zpráva nebyla nastavena.",
        }}
      />
    </>
  );
};

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [data, setData] = useState<InternshipFullRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mobile = useMediaQuery("(max-width: 48rem)");
  const fetchData = (id: string) => {
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
  };
  useEffect(() => {
    fetchData(id);
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
      <Title order={2}>Obecné informace</Title>
      <SimpleGrid cols={mobile ? 1 : 3} spacing="lg">
        <Card shadow="sm" padding="lg">
          <StudentDisplay data={data} />
        </Card>
        <Card shadow="sm" padding="lg">
          <CompanyDisplay data={data} />
        </Card>
        <Card shadow="sm" padding="lg">
          <ContactsDisplay data={data} />
        </Card>
        <Suspense fallback={<LoadingOverlay />}>
          <DataDisplay data={data} />
        </Suspense>
        <Suspense fallback={<LoadingOverlay />}>
          <InternshipDisplay data={data} />
        </Suspense>
        <Suspense fallback={<LoadingOverlay />}>
          <InspectionsDisplay data={data} />
        </Suspense>
        <Suspense fallback={<LoadingOverlay />}>
          <LocationDisplay data={data} />
        </Suspense>
        <Suspense fallback={<LoadingOverlay />}>
          <StateDisplay
            data={data}
            reloadData={() => {
              fetchData(id);
            }}
          />
        </Suspense>
        <Card shadow="sm" padding="lg">
          <AgreementDownload internshipId={data.id} />
        </Card>
        <Card shadow="sm" padding="lg">
          <ConclusionDisplay data={data} />
        </Card>
      </SimpleGrid>
    </>
  );
};
export default Page;
