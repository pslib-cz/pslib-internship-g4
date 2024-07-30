"use client";

import Link from "next/link";
import { Title, Box, Button, Breadcrumbs, Anchor, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import TextsTable from "./TextsTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Text>Texty</Text>
      </Breadcrumbs>
      <Title order={2}>Texty</Title>
      <Box my={10}>
        <Button
          component={Link}
          href="/dashboard/texts/create"
          variant="default"
          leftSection={<IconPlus />}
        >
          Nový
        </Button>
      </Box>
      <TextsTable />
    </>
  );
};

export default Page;
