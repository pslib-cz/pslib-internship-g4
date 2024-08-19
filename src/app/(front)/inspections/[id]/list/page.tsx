"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import InspectionsTable from "./InspectionsTable";
import { LoadingOverlay } from "@mantine/core";
import { Button, Title, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  return (
    <>
      <Title mt="sm" order={2}>
        Proběhlé kontroly
      </Title>
      <Group mt="sm">
        <Button
          variant="filled"
          component={Link}
          href={`/inspections/${id}/create`}
          leftSection={<IconPlus />}
        >
          Nová
        </Button>
        <Button variant="default" component={Link} href={`/inspections/${id}`}>
          Podrobnosti o praxi
        </Button>
      </Group>
      <Suspense fallback={<LoadingOverlay />}>
        <InspectionsTable internshipId={id} />
      </Suspense>
    </>
  );
};

export default Page;
