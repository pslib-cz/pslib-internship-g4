"use client";

import Link from "next/link";
import {
  Title,
  Loader,
  Box,
  Button,
  Anchor,
  Text,
  Breadcrumbs,
  Flex,
} from "@mantine/core";
import { useContext, Suspense } from "react";
import { IconHomePlus } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { FilterContext } from "@/providers/CompanyFilterProvider";
import { CompaniesTable } from "./CompaniesTable";

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [state, dispatch] = useContext(FilterContext);
  return (
    <>
      <Breadcrumbs separatorMargin="md" mt="xs">
        <Anchor component={Link} href="/">
          Titulní stránka
        </Anchor>
        <Text>Firmy</Text>
      </Breadcrumbs>
      <Title my="lg" order={2}>
        Seznam firem
      </Title>
      <Flex my={10} gap="sm" wrap="wrap">
        {status === "authenticated" &&
          (session?.user.role === "admin" ||
            session?.user.role === "teacher" ||
            session?.user.role === "student") && (
            <>
              <Button
                variant="filled"
                component={Link}
                href="/companies/import"
                leftSection={<IconHomePlus />}
              >
                Importovat firmu přes ARES
              </Button>
              <Button
                component={Link}
                href="/companies/create"
                variant="default"
              >
                Přidat firmu ručně
              </Button>
            </>
          )}
        <Button
          onClick={(e) => dispatch({ type: "SET_OPENED", opened: true })}
          variant="default"
        >
          Rozšířený filtr
        </Button>
        <Button component={Link} href="/companies/map" variant="default">
          Mapa
        </Button>
      </Flex>
      <Box pos="relative"></Box>
      <Suspense fallback={<Loader />}>
        <CompaniesTable />
      </Suspense>
    </>
  );
};

export default Page;
