"use client";

import Link from "next/link";
import {
  ScrollArea,
  Title,
  Box,
  Button,
  Breadcrumbs,
  Anchor,
  Text,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import DiaryTable from "./DiaryTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Text>Deníky</Text>
      </Breadcrumbs>
      <Title order={2}>Deníky</Title>
      <Box my={10}>
        <Button
          component={Link}
          href="/dashboard/diaries/create"
          variant="default"
          leftSection={<IconPlus />}
        >
          Nový záznam
        </Button>
      </Box>
      <ScrollArea type="auto">
        <DiaryTable />
      </ScrollArea>
    </>
  );
};

export default Page;
