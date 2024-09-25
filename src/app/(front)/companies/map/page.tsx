"use client";

import { useContext, Suspense, useMemo } from "react";
import {
  Breadcrumbs,
  Anchor,
  Text,
  Title,
  LoadingOverlay,
  Box,
  ActionIcon,
  Flex,
} from "@mantine/core";
import Link from "next/link";
import { IconFilter } from "@tabler/icons-react";
import { FilterContext } from "@/providers/CompanyFilterProvider";
//import MapDisplay from "./MapDisplay";
import dynamic from "next/dynamic";

const Page = () => {
  const [state, dispatch] = useContext(FilterContext);
  const MapDisplay = useMemo(
    () =>
      dynamic(() => import("./MapDisplay"), {
        loading: () => <LoadingOverlay />,
        ssr: false,
      }),
    [],
  );
  return (
    <>
      <Breadcrumbs separatorMargin="md" mt="xs">
        <Anchor component={Link} href="/">
          Titulní stránka
        </Anchor>
        <Anchor component={Link} href="/companies">
          Firmy
        </Anchor>
        <Text>Mapa</Text>
      </Breadcrumbs>
      <Flex
        gap="md"
        my="lg"
        justify="flex-start"
        align="flex-start"
        direction="row"
      >
        <Title order={2}>Mapa firem</Title>
        <ActionIcon
          variant="light"
          onClick={() => dispatch({ type: "SET_OPENED", opened: true })}
        >
          <IconFilter />
        </ActionIcon>
      </Flex>
      <Box p="sm">
        <Suspense fallback={<LoadingOverlay />}>
          <MapDisplay />
        </Suspense>
      </Box>
    </>
  );
};

export default Page;
