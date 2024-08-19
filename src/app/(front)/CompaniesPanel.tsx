"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Autocomplete,
  Title,
  Paper,
  ActionIcon,
  useMantineTheme,
  Anchor,
  Box,
  rem,
} from "@mantine/core";
import { IconSearch, IconArrowRight } from "@tabler/icons-react";
import { Company } from "@prisma/client";
import { useRouter } from "next/navigation";
import styles from "./CompaniesPanel.module.css";

const CompaniesPanel = () => {
  const theme = useMantineTheme();
  const [search, setSearch] = useState("");
  const [foundCompanies, setFoundCompanies] = useState([]);
  const router = useRouter();
  useEffect(() => {
    if (search.length > 2) {
      fetch(`/api/companies?search=${search}&active=true&orderBy=name`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            setFoundCompanies([]);
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setFoundCompanies(data.data.map((company: Company) => company.name));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [search]);
  const handleGo = () => {
    router.push(`/companies?name=${search}`);
  };

  return (
    <Paper className="styles.container" bg="transparent" m={0}>
      <Title mb="sm" order={2}>
        Firmy
      </Title>
      <Autocomplete
        radius="xl"
        size="md"
        placeholder="Prohledávání seznamu firem podle názvu"
        rightSectionWidth={42}
        leftSection={
          <IconSearch
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
          />
        }
        onSubmit={handleGo}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleGo();
          }
        }}
        rightSection={
          <ActionIcon
            size={32}
            radius="xl"
            color={theme.primaryColor}
            variant="filled"
            onClick={handleGo}
          >
            <IconArrowRight
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
        }
        data={foundCompanies}
        value={search}
        onChange={setSearch}
      />
    </Paper>
  );
};

export default CompaniesPanel;
