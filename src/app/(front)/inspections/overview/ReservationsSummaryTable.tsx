import React, { FC, useEffect, useState } from "react";
import { Table, Loader, Alert, Text } from "@mantine/core";

type ReservationSummary = {
  reservationUserId: string;
  count: number;
  givenName: string;
  surname: string;
  inspected?: string;
};

type ReservationSummaryTableProps = {
  setId: number | null;
};

const ReservationSummaryTable: FC<ReservationSummaryTableProps> = ({
  setId,
}) => {
  const [data, setData] = useState<ReservationSummary[]>([]);
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
          `/api/summaries/reservations?${queryString}`,
        );
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching reservation summary:", err);
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
            <Table.Th>Učitel</Table.Th>
            <Table.Th>Počet rezervací</Table.Th>
            <Table.Th>Zkontrolováno</Table.Th>
            <Table.Th>%</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map(
            ({ reservationUserId, givenName, surname, count, inspected }) => (
              <Table.Tr key={reservationUserId}>
                <Table.Td>{`${surname}, ${givenName}`}</Table.Td>
                <Table.Td>{count}</Table.Td>
                <Table.Td>{inspected ?? "-"}</Table.Td>
                <Table.Td>
                  {inspected ? (
                    <Text>
                      {((Number(inspected) / count) * 100).toFixed(2)}%
                    </Text>
                  ) : (
                    <Text>-</Text>
                  )}
                </Table.Td>
              </Table.Tr>
            ),
          )}
        </Table.Tbody>
      </Table>
    </>
  );
};

export default ReservationSummaryTable;
