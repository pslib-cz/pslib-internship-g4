"use client";

import React, { FC, useEffect, useState, useMemo } from "react";
import { Table, Loader, Alert, Text, Stack, SimpleGrid } from "@mantine/core";
import { PieChart } from "@mantine/charts";

type InternshipStateSummary = {
  total: number;
  reserved: number;
  inspected: number;
};

type InternshipStateGraphProps = {
  setId: number | null;
};

const InternshipStateGraph: FC<InternshipStateGraphProps> = ({ setId }) => {
  const [data, setData] = useState<InternshipStateSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySet = setId ? `set=${encodeURIComponent(setId)}` : "";
        const queryActive = `active=true`;
        const queryString = [querySet, queryActive].filter(Boolean).join("&");

        const response = await fetch(`/api/graphs/state?${queryString}`);
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching internship state:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setId]);

  const summary = useMemo(() => {
    if (!data) return null;

    const { total, reserved, inspected } = data;
    const unreserved = total - reserved;
    const reservedButNotInspected = reserved - inspected;

    const pieData = [
      { name: "Zkontrolováno", value: inspected, color: "green.6" },
      {
        name: "Nezkontrolováno",
        value: reservedButNotInspected,
        color: "orange.6",
      },
      { name: "Nezarezervováno", value: unreserved, color: "gray.6" },
    ];

    const formatPercent = (count: number) =>
      total > 0 ? `${((count / total) * 100).toFixed(1)} %` : "0 %";

    return {
      total,
      reserved,
      inspected,
      unreserved,
      reservedButNotInspected,
      pieData,
      formatPercent,
    };
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error.message}</Alert>;
  if (!summary) return <Text>Žádná data k zobrazení.</Text>;

  const { total, reserved, inspected, unreserved, pieData, formatPercent } =
    summary;

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 1, md: 2 }}
      spacing="lg"
      verticalSpacing="lg"
    >
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Stav</Table.Th>
            <Table.Th>Počet</Table.Th>
            <Table.Th>Podíl</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td c="green.6">Zkontrolováno</Table.Td>
            <Table.Td>{inspected}</Table.Td>
            <Table.Td>{formatPercent(inspected)}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td c="orange.6">Nezkontrolováno</Table.Td>
            <Table.Td>{reserved - inspected}</Table.Td>
            <Table.Td>{formatPercent(reserved - inspected)}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Nezarezervováno</Table.Td>
            <Table.Td>{unreserved}</Table.Td>
            <Table.Td>{formatPercent(unreserved)}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tfoot>
          <Table.Tr>
            <Table.Td>
              <strong>Celkem</strong>
            </Table.Td>
            <Table.Td>
              <strong>{total}</strong>
            </Table.Td>
            <Table.Td>
              <strong>100 %</strong>
            </Table.Td>
          </Table.Tr>
        </Table.Tfoot>
      </Table>

      <PieChart
        data={pieData}
        labelsPosition="inside"
        labelsType="value"
        withLabels
      />
    </SimpleGrid>
  );
};

export default InternshipStateGraph;
