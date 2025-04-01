"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  InspectionWithInspectorAndInternship,
  InternshipFullRecord,
} from "@/types/entities";
import {
  SimpleGrid,
  Card,
  Title,
  Text,
  Anchor,
  Alert,
  Box,
  Table,
  Group,
  Button,
  Tooltip,
} from "@mantine/core";
import Link from "next/link";
import Address from "@/components/Address/Address";
import { DateTime, Coordinates, AgreementDownload } from "@/components";
import { useMediaQuery } from "@mantine/hooks";
import { inspectionResults } from "@/data/lists";
import { Diary } from "@prisma/client";
import SwitchInternshipState from "@/components/SwitchInternshipState/SwitchInternshipState";
import StudentDisplay from "@/components/InternshipCards/StudentDisplay/StudentDisplay";
import CompanyDisplay from "@/components/InternshipCards/CompanyDisplay/CompanyDisplay";
import ContactsDisplay from "@/components/InternshipCards/ContactsDisplay/ContactsDisplay";

const SetDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <>
      <Title order={2}>Termíny</Title>
      <Text fw={700}>Začátek</Text>
      <Text>
        <DateTime date={data.set.start} locale="cs" />
      </Text>
      <Text fw={700}>Konec</Text>
      <Text>
        <DateTime date={data.set.end} locale="cs" />
      </Text>
      <Text fw={700}>Druh</Text>
      <Text>{data.set.continuous ? "průběžná" : "souvislá"}</Text>
      <Text fw={700}>Počet dní celkem</Text>
      <Text>{data.set.daysTotal}</Text>
      <Text fw={700}>Hodin denně</Text>
      <Text>{data.set.hoursDaily}</Text>
    </>
  );
};

const LoacationDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <>
      <Title order={2}>Lokalita</Title>
      <Text fw={700}>Adresa</Text>
      <Text>
        <Address
          municipality={data.location.municipality ?? ""}
          street={data.location.street ?? "?"}
          descNum={data.location.descNo}
          orientNum={data.location.orientNo}
          country=""
          postalCode={data.location.postalCode}
        />
      </Text>
      <Text fw={700}>Souřadnice</Text>
      <Text>
        <Coordinates
          latitude={data.location.latitude}
          longitude={data.location.longitude}
        />
      </Text>
    </>
  );
};

const InspectionsDisplay = ({ data }: { data: InternshipFullRecord }) => {
  const [insp, setInsp] = useState<
    InspectionWithInspectorAndInternship[] | null
  >(null);
  const [res, setRes] = useState<{ key: string; count: number }[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    fetch("/api/inspections/?internship=" + data.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          setInsp(null);
          if (response.status === 404) {
            throw new Error("Taková praxe neexistuje.");
          }
          throw new Error("Při získávání dat došlo k chybě.");
        }
        return response.json();
      })
      .then((data) => {
        setInsp(data.data);
        const counts = inspectionResults.map((res) => {
          return {
            key: res.value,
            count: data.data.filter(
              (insp: InspectionWithInspectorAndInternship) =>
                insp.result === Number(res.value),
            ).length,
          };
        });
        setRes(counts);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data.id]);
  if (loading) {
    return <div>Načítám data...</div>;
  }
  if (error) {
    return <Alert color="red">{error.message}</Alert>;
  }
  return (
    <>
      <Title order={2}>Kontroly</Title>
      <Text fw={700}>Rezervace</Text>
      <Text>{data.reservationUserId ?? "nikdo"}</Text>
      <Text fw={700}>Žádoucí</Text>
      <Text>{data.highlighted ? "ano" : "ne"}</Text>
      <Text fw={700}>Počet</Text>
      <Text>{insp?.length ?? 0}</Text>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Výsledek</Table.Th>
            <Table.Th>Počet</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {res?.map((row) => (
            <Table.Tr key={row.key}>
              <Table.Td>
                {inspectionResults.find((res) => res.value === row.key)?.label}
              </Table.Td>
              <Table.Td>{row.count}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Group justify="center" mt="sm">
        <Tooltip label="Zobrazení všech záznamů o kontrolách">
          <Button
            variant="default"
            component={Link}
            href={`/inspections/${data.id}/list`}
          >
            Zobrazit seznam
          </Button>
        </Tooltip>
      </Group>
    </>
  );
};

const DiaryDisplay = ({ data }: { data: InternshipFullRecord }) => {
  const [diary, setDiary] = useState<Diary[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    fetch("/api/internships/" + data.id + "/diary?orderBy=date", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          setDiary(null);
          if (response.status === 404) {
            throw new Error(
              "Taková praxe neexistuje nebo se nepodařilo načíst data.",
            );
          }
          throw new Error("Při získávání dat došlo k chybě.");
        }
        return response.json();
      })
      .then((data) => {
        setDiary(data.data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data.id]);
  if (loading) {
    return <div>Načítám data...</div>;
  }
  if (error) {
    return <Alert color="red">{error.message}</Alert>;
  }
  return (
    <>
      <Title order={2}>Deník</Title>
      <Text fw={700}>Veřejný deník pro kontrolu</Text>
      <Tooltip label="Odkaz na veřejný deník - lze zaslat firmě ke kontrole">
        <Anchor href={"/diary/" + data.id}>{"/diary/" + data.id}</Anchor>
      </Tooltip>
      <Text fw={700}>Počet záznamů</Text>
      <Text>{diary ? diary.length : 0}</Text>
      <Group mt="sm" justify="center">
        <Tooltip label="Zobrazení všech záznamů">
          <Button
            variant="default"
            component={Link}
            href={`/inspections/${data.id}/diary`}
          >
            Zobrazit seznam
          </Button>
        </Tooltip>
      </Group>
    </>
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
        <LoacationDisplay data={data} />
      </Card>
      <Card shadow="sm" padding="lg">
        <InspectionsDisplay data={data} />
      </Card>
      <Card shadow="sm" padding="lg">
        <DiaryDisplay data={data} />
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
