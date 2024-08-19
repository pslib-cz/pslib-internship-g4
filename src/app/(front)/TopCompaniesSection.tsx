"use client";

import React, { useState, useEffect, FC } from "react";
import { Container, Box, Table, Title, Text, Anchor } from "@mantine/core";
import Link from "next/link";
import styles from "./TopCompaniesSection.module.css";

type TopCompaniesSectionProps = {};

type CompanyRecord = {
  id: number;
  name: string;
  _count: {
    internships: number;
  };
};

const TopCompaniesSection: FC<TopCompaniesSectionProps> = () => {
  const [data, setData] = useState<CompanyRecord[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    fetch("/api/companies/stats/top?amount=10", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Nepodařilo se načíst statistická data.");
      })
      .then((data) => setData(data))
      .catch((error) => setError(error));
  }, []);
  return (
    <Box className={styles.panel}>
      <Container>
        <Title order={2}>Firmy s nejvíce praxemi</Title>
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Pořadí</Table.Th>
              <Table.Th>Firma</Table.Th>
              <Table.Th>Počet praxí</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {error && (
              <Table.Tr>
                <Table.Td colSpan={3}>
                  <Text ta="center">{error.message}</Text>
                </Table.Td>
              </Table.Tr>
            )}
            {data === null && (
              <Table.Tr>
                <Table.Td colSpan={3}>
                  <Text ta="center">Získávám data...</Text>
                </Table.Td>
              </Table.Tr>
            )}
            {data && data.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={3}>
                  <Text ta="center">Žádná data</Text>
                </Table.Td>
              </Table.Tr>
            )}
            {data &&
              data.map((company, index) => (
                <Table.Tr key={company.id}>
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td>
                    <Anchor component={Link} href={`/companies/${company.id}`}>
                      {company.name}
                    </Anchor>
                  </Table.Td>
                  <Table.Td>{company._count.internships}</Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Container>
    </Box>
  );
};

export default TopCompaniesSection;
