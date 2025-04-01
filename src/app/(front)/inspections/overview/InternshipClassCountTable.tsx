import React, { FC, useState, useEffect } from "react";
import { Table, Anchor, Alert, Loader, ScrollArea } from "@mantine/core";

type InternshipClassCountTableProps = {
  setId: number | null;
};
type Summary = {
  classname: string;
  totalInternships: number;
  uniqueStudents: number;
};

const InternshipClassCountTable: FC<InternshipClassCountTableProps> = ({
  setId,
}) => {
  const [data, setData] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySet = setId !== null && !isNaN(setId) ? `set=${setId}` : "";
        const queryActive = `active=true`;
        const queryString = [querySet, queryActive].filter(Boolean).join("&");
        const response = await fetch(
          `/api/summaries/classrooms?${queryString}`,
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
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
    <ScrollArea type="auto">
      <Table highlightOnHover striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Třída</Table.Th>
            {data.map((row) => (
              <Table.Th key={row.classname}>{row.classname}</Table.Th>
            ))}
            <Table.Th>Celkem</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Praxe</Table.Td>
            {data.map((row) => (
              <Table.Td key={row.classname}>
                <Anchor href={"/inspections?classname=" + row.classname}>
                  {row.totalInternships}
                </Anchor>
              </Table.Td>
            ))}
            <Table.Td>
              {data.reduce((acc, row) => acc + row.totalInternships, 0)}
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Studenti</Table.Td>
            {data.map((row) => (
              <Table.Td key={row.classname}>{row.uniqueStudents}</Table.Td>
            ))}
            <Table.Td>
              {data.reduce((acc, row) => acc + row.uniqueStudents, 0)}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
};

export default InternshipClassCountTable;
