"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Title,
  Text,
  Loader,
  Alert,
  Grid,
  GridCol,
  Anchor,
} from "@mantine/core";
import styles from "./InspectionsSection.module.css";

const InternshipsSection = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/summaries/active-inspections");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box className={styles.panel}>
        <Container>
          <Loader />
          <Text>Načítání dat...</Text>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={styles.panel}>
        <Container>
          <Alert color="red">{error.message}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box className={styles.panel}>
      <Container>
        <Title order={2}>Kontroly praxí</Title>
        {data.length === 0 && (
          <Text c="gray" style={{ textAlign: "center" }}>
            Právě neprobíhají ani se nepřipravují žádné praxe.
          </Text>
        )}
        <Grid>
          {data.map((set) => (
            <GridCol key={set.setId} span={12}>
              <Box mb="md">
                <Title order={3}>{set.setName}</Title>
                <Text>
                  Celkový počet praxí:{" "}
                  <Anchor href="/inspections">
                    <strong>{set.totalInternships}</strong>
                  </Anchor>
                  . Zkontrolovat chcete:{" "}
                  <Anchor href="/inspections/reservations">
                    <strong>{set.reservedByUser}</strong>
                  </Anchor>
                  . Celkem proběhlo kontrol:{" "}
                  <strong>{set.checkedByUser}</strong>.
                </Text>
              </Box>
            </GridCol>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default InternshipsSection;
