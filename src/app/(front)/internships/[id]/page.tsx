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
import { InternshipFullRecord } from "@/types/entities";
import DateTime from "@/components/DateTime/DateTime";
import Link from "next/link";
import { getInternshipKindLabel } from "@/data/lists";
import Address from "@/components/Address/Address";
import SwitchInternshipState from "@/components/SwitchInternshipState/SwitchInternshipState";
import { AgreementDownload } from "@/components";

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

const ContactsDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={3}>Kontakty</Title>
      <Title order={4}>Zástupce firmy</Title>
      <Text>Člověk zastupující firmu a podepisující za ní smlouvu</Text>
      <Text fw={700}>Jméno a příjmení</Text>
      <Text>{data.companyRepName}</Text>
      <Text fw={700}>Email</Text>
      <Text>
        {data.companyRepEmail ? (
          <Anchor component={Link} href={`mailto:${data.companyRepEmail}`}>
            {data.companyRepEmail}
          </Anchor>
        ) : (
          "není"
        )}
      </Text>
      <Text fw={700}>Telefon</Text>
      <Text>
        {data.companyRepPhone ? (
          <Anchor component={Link} href={`tel:${data.companyRepPhone}`}>
            {data.companyRepPhone}
          </Anchor>
        ) : (
          "není"
        )}
      </Text>
      <Title order={4}>Kontaktní osoba</Title>
      <Text>Osoba řídící praxi studenta</Text>
      <Text fw={700}>Jméno a příjmení</Text>
      <Text>{data.companyMentorName}</Text>
      <Text fw={700}>Email</Text>
      <Text>
        {data.companyMentorEmail ? (
          <Anchor component={Link} href={`mailto:${data.companyMentorEmail}`}>
            {data.companyMentorEmail}
          </Anchor>
        ) : (
          "není"
        )}
      </Text>
      <Text fw={700}>Telefon</Text>
      <Text>
        {data.companyMentorPhone ? (
          <Anchor component={Link} href={`tel:${data.companyMentorPhone}`}>
            {data.companyMentorPhone}
          </Anchor>
        ) : (
          "není"
        )}
      </Text>
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

const StudentDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={3}>Student</Title>
      <Text fw={700}>Příjmení a jméno</Text>
      <Text>
        {data.user.surname}, {data.user.givenName}
      </Text>
      <Text fw={700}>Třída</Text>
      <Text>{data.classname ?? "není"}</Text>
      <Text fw={700}>Email</Text>
      <Text>
        {data.user.email ? (
          <Anchor component={Link} href={`mailto:${data.user.email}`}>
            {data.user.email}
          </Anchor>
        ) : (
          "není"
        )}
      </Text>
      <Text fw={700}>Telefon</Text>
      <Text>
        {data.user.phone ? (
          <Anchor component={Link} href={`tel:${data.user.phone}`}>
            {data.user.phone}
          </Anchor>
        ) : (
          "není"
        )}
      </Text>
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

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [data, setData] = useState<InternshipFullRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
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
      <SimpleGrid cols={2} spacing="lg">
        <Suspense fallback={<LoadingOverlay />}>
          <DataDisplay data={data} />
        </Suspense>
        <Suspense fallback={<LoadingOverlay />}>
          <ContactsDisplay data={data} />
        </Suspense>
        <Suspense fallback={<LoadingOverlay />}>
          <InternshipDisplay data={data} />
        </Suspense>
        <Suspense fallback={<LoadingOverlay />}>
          <StudentDisplay data={data} />
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
      </SimpleGrid>
    </>
  );
};
export default Page;
