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
import LocationsTable from "./LocationsTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Text>Místa</Text>
      </Breadcrumbs>
      <Title order={2}>Místa</Title>
      <Box my={10}>
        <Button
          component={Link}
          href="/dashboard/locations/create"
          variant="default"
          leftSection={<IconPlus />}
        >
          Nové
        </Button>
      </Box>
      <LocationsTable />
    </>
  );
};

export default Page;
