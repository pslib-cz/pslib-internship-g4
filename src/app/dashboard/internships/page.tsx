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
import { IconPlus } from "@tabler/icons-react"
import InternshipsTable from "./InternshipsTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Text>Praxe</Text>
      </Breadcrumbs>
      <Title order={2}>Praxe</Title>
      <Box my={10}>
        <Button
          component={Link}
          href="/dashboard/internships/create"
          variant="default"
          leftSection={<IconPlus />}
        >
          Nová
        </Button>
      </Box>
      <ScrollArea type="auto">
        <InternshipsTable />
      </ScrollArea>
    </>
  );
};

export default Page;
