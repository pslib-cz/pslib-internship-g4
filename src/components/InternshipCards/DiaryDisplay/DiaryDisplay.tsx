"use client";

import React, { useState, useEffect } from "react";
import { InternshipFullRecord } from "@/types/entities";
import {
  Title,
  Text,
  Anchor,
  Alert,
  Group,
  Button,
  Tooltip,
} from "@mantine/core";
import Link from "next/link";
import { Diary } from "@prisma/client";

const DiaryDisplay = ({
  data,
  linkToList,
  linkToPublicList,
}: {
  data: InternshipFullRecord;
  linkToList: string;
  linkToPublicList: string;
}) => {
  const [diary, setDiary] = useState<Diary[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    fetch("/api/internships/" + data.id + "/diary?orderBy=date", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          setDiary(null);
          if (response.status === 404) {
            throw new Error(
              "Taková praxe neexistuje nebo se nepodařilo načíst data.",
            );
          }
          throw new Error("Při získávání dat došlo k chybě.");
        }
        return response.json();
      })
      .then((data) => {
        setDiary(data.data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data.id]);
  if (loading) {
    return <div>Načítám data...</div>;
  }
  if (error) {
    return <Alert color="red">{error.message}</Alert>;
  }
  return (
    <>
      <Title order={2}>Deník</Title>
      <Text fw={700}>Veřejný deník pro kontrolu</Text>
      <Tooltip label="Odkaz na veřejný deník - lze zaslat firmě ke kontrole">
        <Anchor href={linkToPublicList}>{linkToPublicList}</Anchor>
      </Tooltip>
      <Text fw={700}>Počet záznamů</Text>
      <Text>{diary ? diary.length : 0}</Text>
      <Group mt="sm" justify="center">
        <Tooltip label="Zobrazení všech záznamů">
          <Button variant="default" component={Link} href={linkToList}>
            Zobrazit seznam
          </Button>
        </Tooltip>
      </Group>
    </>
  );
};

export default DiaryDisplay;
