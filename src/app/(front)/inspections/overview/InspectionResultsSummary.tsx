import React, { FC, useEffect, useState } from "react";
import { Table, Loader, Alert, Text } from "@mantine/core";
import { InspectionResult } from "@/types/data";

type InspectionResultSummary = {
  result: number;
  label: string;
  count: number;
};

// Popisné texty pro jednotlivé výsledky
const inspectionResultLabels: { [key in InspectionResult]: string } = {
  [InspectionResult.UNKNOWN]: "Neznámý",
  [InspectionResult.OK]: "V pořádku",
  [InspectionResult.PROBLEMS]: "Se studentem jsou problémy",
  [InspectionResult.NOT_PRESENT]: "Student nebyl přítomen",
  [InspectionResult.NOT_KNOWN]: "O studentovi nevědí",
};

type InspectionResultsSummaryProps = {
  setId: number | null;
};

const InspectionResultsSummary: FC<InspectionResultsSummaryProps> = ({
  setId,
}) => {
  const [data, setData] = useState<InspectionResultSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySet = setId ? `set=${encodeURIComponent(setId)}` : "";
        //const querySet = setId !== null && !isNaN(setId) ? `set=${setId}` : "";
        const queryActive = `active=true`;
        const queryString = [querySet, queryActive].filter(Boolean).join("&");

        const response = await fetch(
          `/api/summaries/inspection-results?${queryString}`,
        );
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const result = await response.json();

        // Zajistíme, že všechny možnosti z enumerace jsou zahrnuty
        const allResults = Object.values(InspectionResult)
          .filter((value) => typeof value === "number")
          .map((key) => ({
            result: key as InspectionResult,
            label: inspectionResultLabels[key as InspectionResult],
            count:
              result.find((r: InspectionResultSummary) => r.result === key)
                ?.count || 0,
          }));

        setData(allResults);
      } catch (err) {
        console.error("Error fetching inspection results summary:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Alert color="red">{error.message}</Alert>;
  }

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Výsledek</Table.Th>
            <Table.Th>Počet</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map(({ result, label, count }) => (
            <Table.Tr key={result}>
              <Table.Td>{label}</Table.Td>
              <Table.Td>{count}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
};

export default InspectionResultsSummary;
