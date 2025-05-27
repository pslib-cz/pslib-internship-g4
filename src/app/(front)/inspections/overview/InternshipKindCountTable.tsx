import React, { FC, useEffect, useState } from "react";
import { Table, Loader, Alert, Text } from "@mantine/core";

type InternshipKindSummary = {
  kind: number;
  count: number;
};

const internshipKinds: { [key: number]: string } = {
  0: "Prezenčně na pracovišti",
  1: "Homeoffice",
};

type InternshipKindsTableProps = {
  setId: number | null;
};

const InternshipKindsTable: FC<InternshipKindsTableProps> = ({ setId }) => {
  const [data, setData] = useState<InternshipKindSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySet = setId ? `set=${encodeURIComponent(setId)}` : "";
        const queryActive = `active=true`;
        const queryString = [querySet, queryActive].filter(Boolean).join("&");

        const response = await fetch(`/api/summaries/kinds?${queryString}`);
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching internship kinds:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setId]);

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
            <Table.Th>Druh praxe</Table.Th>
            <Table.Th>Počet</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map(({ kind, count }) => (
            <Table.Tr key={kind}>
              <Table.Td>
                {internshipKinds[kind] || `Neznámý druh (${kind})`}
              </Table.Td>
              <Table.Td>{count}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
};

export default InternshipKindsTable;
