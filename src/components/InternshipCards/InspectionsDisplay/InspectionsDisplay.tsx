"use client";

import React, { useState, useEffect } from "react";
import {
  InspectionWithInspectorAndInternship,
  InternshipFullRecord,
} from "@/types/entities";
import {
  Title,
  Text,
  Alert,
  Table,
  Group,
  Button,
  Tooltip,
} from "@mantine/core";
import Link from "next/link";
import { inspectionResults } from "@/data/lists";

const InspectionsDisplay = ({
  data,
  linkToList,
}: {
  data: InternshipFullRecord;
  linkToList: string;
}) => {
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

export default InspectionsDisplay;
