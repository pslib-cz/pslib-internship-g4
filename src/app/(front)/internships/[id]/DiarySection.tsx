import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  Title,
  Table,
  Alert,
  TableTr,
  TableTh,
  TableTd,
  Paper,
} from "@mantine/core";
import { Diary } from "@prisma/client";

type DiarySectionProps = {
  id: string;
};

const DiarySection: React.FC<DiarySectionProps> = ({ id }) => {
  const [records, setRecords] = useState<Diary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const loadData = useCallback((id: string) => {
    setLoading(true);
    fetch(`/api/internships/${id}/diary?orderBy=created`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          setRecords(null);
          setError(new Error("Došlo k chybě při získávání dat."));
          throw new Error("Nepodařilo se načíst záznamy deníku.");
        }
        return response.json();
      })
      .then((data) => {
        setRecords(data.data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    loadData(id);
  }, [loadData, id]);
  return (
    <Paper p="md">
      <Title order={2}>Deník</Title>
      {loading && <p>Načítám data...</p>}
      {error && <Alert color="red">{error.message}</Alert>}
      {records && records.length === 0 && (
        <Alert color="blue">Žádné záznamy</Alert>
      )}
      {records && records.length > 0 && (
        <Table mt="sm">
          <TableTr>
            <TableTh>Datum</TableTh>
            <TableTh>Popis</TableTh>
            <TableTh>Možnosti</TableTh>
          </TableTr>
        </Table>
      )}
    </Paper>
  );
};

export default DiarySection;