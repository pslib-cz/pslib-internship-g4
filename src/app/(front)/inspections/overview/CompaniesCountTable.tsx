import React, { FC, useEffect, useState } from "react";
import { Table, Anchor, Alert, Loader } from "@mantine/core";

type CompanySummary = {
  companyId: number;
  companyName: string;
  totalStudents: number;
};

type InternshipCompanyTableProps = {
  setId: number | null;
};

const InternshipCompanyTable: FC<InternshipCompanyTableProps> = ({ setId }) => {
  const [data, setData] = useState<CompanySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySet = setId ? `set=${encodeURIComponent(setId)}` : "";
        const queryActive = `active=true`;
        const queryString = [querySet, queryActive].filter(Boolean).join("&");

        const response = await fetch(`/api/summaries/companies?${queryString}`);
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
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
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Firma</Table.Th>
          <Table.Th>Studenti</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((row) => (
          <Table.Tr key={row.companyId}>
            <Table.Td>
              <Anchor href={"/companies/" + row.companyId}>
                {row.companyName}
              </Anchor>
            </Table.Td>
            <Table.Td>
              <Anchor href={"/inspections?company=" + row.companyId}>
                {row.totalStudents}
              </Anchor>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
      <Table.Tfoot>
        <Table.Tr>
          <Table.Th>Celkem</Table.Th>
          <Table.Th>
            {data.reduce((acc, row) => acc + row.totalStudents, 0)}
          </Table.Th>
        </Table.Tr>
      </Table.Tfoot>
    </Table>
  );
};

export default InternshipCompanyTable;
