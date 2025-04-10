"use client";

import React, { useState, useEffect, useCallback } from "react";
import { InternshipFullRecord } from "@/types/entities";
import { SimpleGrid, Card, Title, Alert, Box } from "@mantine/core";
import { AgreementDownload } from "@/components";
import { useMediaQuery } from "@mantine/hooks";
import SwitchInternshipState from "@/components/SwitchInternshipState/SwitchInternshipState";
import StudentDisplay from "@/components/InternshipCards/StudentDisplay/StudentDisplay";
import CompanyDisplay from "@/components/InternshipCards/CompanyDisplay/CompanyDisplay";
import ContactsDisplay from "@/components/InternshipCards/ContactsDisplay/ContactsDisplay";
import SetDisplay from "@/components/InternshipCards/SetDisplay/SetDisplay";
import LocationDisplay from "@/components/InternshipCards/LocationDisplay/LocationDisplay";
import InspectionsDisplay from "@/components/InternshipCards/InspectionsDisplay/InspectionsDisplay";
import DiaryDisplay from "@/components/InternshipCards/DiaryDisplay/DiaryDisplay";

const StateDisplay = ({
  data,
  reloadData,
}: {
  data: InternshipFullRecord;
  reloadData: () => void;
}) => {
  return (
    <>
      <Title order={3}>Stav</Title>
      <SwitchInternshipState internship={data} afterStateChange={reloadData} />
    </>
  );
};

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [data, setData] = useState<InternshipFullRecord | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const mobile = useMediaQuery("(max-width: 48rem)");
  const loaddata = useCallback(async () => {
    setLoading(true);
    fetch("/api/internships/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          setData(null);
          if (response.status === 404) {
            throw new Error("Taková praxe neexistuje.");
          }
          throw new Error("Při získávání dat došlo k chybě.");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  useEffect(() => {
    loaddata();
  }, [loaddata]);
  if (loading) {
    return <div>Načítám data...</div>;
  }
  if (error) {
    return <Alert color="red">{error.message}</Alert>;
  }
  if (!data) {
    return <Alert color="red">Informace nejsou dostupné.</Alert>;
  }
  return (
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
      <Card shadow="sm" padding="lg">
        <SetDisplay data={data} />
      </Card>
      <Card shadow="sm" padding="lg">
        <LocationDisplay data={data} />
      </Card>
      <Card shadow="sm" padding="lg">
        <InspectionsDisplay
          data={data}
          linkToList={`/inspections/${data.id}/list`}
        />
      </Card>
      <Card shadow="sm" padding="lg">
        <DiaryDisplay
          data={data}
          linkToList={`/inspections/${data.id}/diary`}
          linkToPublicList={"/diary/" + data.id}
        />
      </Card>
      <Card shadow="sm" padding="lg">
        <StateDisplay
          data={data}
          reloadData={() => {
            loaddata();
          }}
        />
      </Card>
      <Card shadow="sm" padding="lg">
        <Title order={2}>Závěrečná zpráva</Title>
        <Box
          dangerouslySetInnerHTML={{
            __html: data.conclusion ?? "Žádná zpráva nebyla nastavena.",
          }}
        />
      </Card>
      <Card shadow="sm" padding="lg">
        <AgreementDownload internshipId={data.id} />
      </Card>
    </SimpleGrid>
  );
};

export default Page;
