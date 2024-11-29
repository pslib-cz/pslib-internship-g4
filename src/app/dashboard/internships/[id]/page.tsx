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
import { getInternshipKindLabel, getInternshipStateLabel } from "@/data/lists";
import { AgreementDownload } from "@/components";

const DataDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Základní údaje</Title>
      <Text fw={700}>Student</Text>
      <Text>
        <Anchor component={Link} href={`/dashboard/users/${data.userId}`}>
          {data.user.surname}, {data.user.givenName}
        </Anchor>
      </Text>
      <Text fw={700}>Firma</Text>
      <Text>
        <Anchor
          component={Link}
          href={`/dashboard/companies/${data.companyId}`}
        >
          {data.company.name}
        </Anchor>
      </Text>
      <Text fw={700}>Termín</Text>
      <Text>
        {<DateTime date={data.set.start} locale="cs" />} -{" "}
        {<DateTime date={data.set.end} locale="cs" />}
      </Text>
      <Text fw={700}>Sada</Text>
      <Text>
        <Anchor component={Link} href={`/dashboard/sets/${data.setId}`}>
          {data.set.name}
        </Anchor>
      </Text>
      <Text fw={700}>Počet dní</Text>
      <Text>{data.set.daysTotal}</Text>
      <Text fw={700}>Hodiny denně</Text>
      <Text>{data.set.hoursDaily}</Text>
      <Text fw={700}>Druh</Text>
      <Text>{data.set.continuous ? "Průběžná" : "Souvislá"}</Text>
      <Text fw={700}>Způsob</Text>
      <Text>{getInternshipKindLabel(String(data.kind))}</Text>
      <Text fw={700}>Stav</Text>
      <Text>{getInternshipStateLabel(String(data.state))}</Text>
    </Card>
  );
};

const ContactsDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Kontakty</Title>
      <Title order={3}>Zástupce firmy</Title>
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
      <Title order={3}>Kontaktní osoba</Title>
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
      <Title order={2}>Praxe</Title>
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
      <Title order={2}>Student</Title>
      <Text fw={700}>Příjmení a jméno</Text>
      <Text>
        <Anchor component={Link} href={`/dashboard/users/${data.userId}`}>
          {data.user.surname}, {data.user.givenName}
        </Anchor>
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

const InspectionsDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Kontroly</Title>
      <Text fw={700}>Důležitost provedení kontroly</Text>
      <Text>{data.highlighted ? "nutná" : "normální"}</Text>
      <Text fw={700}>Rezervováno</Text>
      {data.reservationUserId ? (
        <Text>
          <Anchor
            component={Link}
            href={`/dashboard/users/${data.reservationUserId}`}
          >
            {data.reservationUser?.surname}, {data.reservationUser?.givenName}
          </Anchor>
        </Text>
      ) : (
        <Text>není</Text>
      )}
    </Card>
  );
};

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [data, setData] = useState<InternshipFullRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
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
        <Anchor component={Link} href="/dashboard/internships">
          Praxe
        </Anchor>
        <Text>Detail</Text>
      </Breadcrumbs>
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
        <Card shadow="sm" padding="lg">
          <AgreementDownload internshipId={id} />
        </Card>
      </SimpleGrid>
    </>
  );
};
export default Page;
