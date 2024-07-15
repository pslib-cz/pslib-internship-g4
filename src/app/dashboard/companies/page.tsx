"use client";

import Link from "next/link";
import { Title, Box, Button, Breadcrumbs, Anchor, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import CompaniesTable from "./CompaniesTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Text>Firmy</Text>
      </Breadcrumbs>
      <Title order={2}>Firmy</Title>
      <Box my={10}>
        <Button
          component={Link}
          href="/dashboard/companies/create"
          variant="default"
          leftSection={<IconPlus />}
        >
          Nová
        </Button>
      </Box>
      <CompaniesTable />
    </>
  );
};

export default Page;
