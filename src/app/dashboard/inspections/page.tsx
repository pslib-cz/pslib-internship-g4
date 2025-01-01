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
import InspectionTable from "./InspectionTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Text>Kontroly</Text>
      </Breadcrumbs>
      <Title order={2}>Kontroly</Title>
      <Box my={10}>
        <Button
          component={Link}
          href="/dashboard/inspections/create"
          variant="default"
          leftSection={<IconPlus />}
        >
          Nová
        </Button>
      </Box>
      <ScrollArea type="auto">
        <InspectionTable />
      </ScrollArea>
    </>
  );
};

export default Page;
