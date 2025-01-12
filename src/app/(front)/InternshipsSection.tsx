import {
  Container,
  Box,
  Grid,
  Title,
  Text,
  Anchor,
} from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./InternshipsSection.module.css";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/personal/[id]/active-internships");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err instanceof Error)
        {
          setError(err);
        }
        else
        {
          setError(new Error("An unknown error occurred"));
        }
      }
    };

    fetchData();
  }, []);

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
        <Grid>
          {data.map((set) => (
            <Box key={set.id}>
              <Title order={3}>{set.name}</Title>
              <Text>
                {new Date(set.start).toLocaleDateString()} - {new Date(set.end).toLocaleDateString()}
              </Text>
              {set.internships.map((internship) => (
                <Box key={internship.id}>
                  <Text>{internship.companyName}</Text>
                </Box>
              ))}
            </Box>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default InternshipsSection;