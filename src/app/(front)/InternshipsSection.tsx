"use client";

import {
  Container,
  Box,
  Group,
  Title,
  Text,
  Anchor,
  Paper,
  Button,
  Stack,
  List,
} from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./InternshipsSection.module.css";
import { useSession } from "next-auth/react";

type Diary = {
  id: number;
  date: string;
  text: string;
};

type Internship = {
  id: string;
  companyRepName: string;
  companyMentorName: string;
  jobDescription: string;
  additionalInfo?: string;
  diaryCount: number;
  companyName: string;
};

type Set = {
  id: number;
  name: string;
  start: string;
  end: string;
  internships: Internship[];
};

const InternshipsSection = () => {
  const [data, setData] = useState<Set[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/api/personal/" + session.user!.id + "/active-internships",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
      }
    };

    fetchData();
  }, [session]);

  if (error) {
    return (
      <Box className={styles.panel}>
        <Container>
          <Title order={2}>Praxe</Title>
          <Text c="red">Error: {error.message}</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box className={styles.panel}>
      <Container>
        <Title order={2}>Praxe</Title>
        <Stack>
          {data.map((set) => (
            <Paper key={set.id} shadow="xs" p="sm" mt="sm">
              <Title order={3}>{set.name}</Title>
              <Text>
                {new Date(set.start).toLocaleDateString()} -{" "}
                {new Date(set.end).toLocaleDateString()}
              </Text>
              {set.internships.map((internship) => (
                <List
                  key={internship.id}
                  spacing="xs"
                  size="sm"
                  m="sm"
                  center
                  listStyleType="disc"
                  withPadding
                >
                  <List.Item>
                    <Anchor href={"/my/" + internship.id}>
                      {internship.companyName}
                    </Anchor>
                  </List.Item>
                </List>
              ))}
              <Group>
                <Button component={Link} href={"/my/create?set=" + set.id}>
                  Nová
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default InternshipsSection;
