"use client";

import React, { useState, useEffect } from "react";
import {
  Title,
  Text,
  Alert,
  Breadcrumbs,
  Anchor,
  LoadingOverlay,
  Table,
  Container,
  Box,
} from "@mantine/core";
import { Diary } from "@prisma/client";
import Link from "next/link";
import { ListResult } from "@/types/data";
import { DateTime } from "@/components";

const Page = ({ params }: { params: { id: number } }) => {
  const id = params.id;
  const [data, setData] = useState<ListResult<Diary> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    setError(null);
    fetch(`/api/diaries?internship=${id}&orderBy=date`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          setData(null);
          if (response.status === 404) {
            throw new Error("Deník nebyl nalezen");
          }
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error: Error) => {
        setError(error);
      })
      .finally(() => {});
  }, [id]);

  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/">
          Titulní stránka
        </Anchor>
        <Anchor component={Link} href="/diary">
          Deníky
        </Anchor>
        <Text>{id}</Text>
      </Breadcrumbs>
      <Container>
        <Title order={1}>Deník praxe</Title>
        {error && <Alert color="red">{error.message}</Alert>}
        {data && (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Datum</Table.Th>
                <Table.Th>Popis</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.data.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>
                    <DateTime date={item.date} locale="cs" />
                  </Table.Td>
                  <Table.Td>
                    <Box
                      dangerouslySetInnerHTML={{ __html: item.text ?? "" }}
                    />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Container>
    </>
  );
};
export default Page;
