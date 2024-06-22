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
import TagsTable from "./TagsTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/dashboard">
          Administrace
        </Anchor>
        <Text>Značky</Text>
      </Breadcrumbs>
      <Title order={2}>Značky</Title>
      <Box my={10}>
        <Button
          component={Link}
          href="/dashboard/tags/create"
          variant="default"
          leftSection={<IconPlus />}
        >
          Nová
        </Button>
      </Box>
      <ScrollArea type="auto">
        <TagsTable />
      </ScrollArea>
    </>
  );
};

export default Page;
