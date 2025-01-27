import React, { FC, useEffect, useState } from "react";
import { Table, Loader, Alert, Text } from "@mantine/core";

type InspectorSummary = {
  inspectionUserId: string;
  count: number;
  givenName: string;
  surname: string;
};

type InspectorSummaryTableProps = {
  setId: number | null;
};

const InspectorSummaryTable: FC<InspectorSummaryTableProps> = ({ setId }) => {
  const [data, setData] = useState<InspectorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySet = setId ? `set=${encodeURIComponent(setId)}` : "";
        const queryActive = `active=true`;
        const queryString = [querySet, queryActive].filter(Boolean).join("&");

        const response = await fetch(
          `/api/summaries/inspectors?${queryString}`,
        );
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching inspectors summary:", err);
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
            <Table.Th>Učitel</Table.Th>
            <Table.Th>Počet kontrol</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map(({ inspectionUserId, givenName, surname, count }) => (
            <Table.Tr key={inspectionUserId}>
              <Table.Td>{`${surname}, ${givenName}`}</Table.Td>
              <Table.Td>{count}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
};

export default InspectorSummaryTable;
