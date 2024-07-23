"use client";

import React, { FC, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Title,
  Button,
  ActionIcon,
  Text,
  TextInput,
  Modal,
  Group,
  Alert,
  Pagination,
  Flex,
  Collapse,
  Box,
  Paper,
  Grid,
} from "@mantine/core";
import {
  IconInfoSmall,
  IconTrash,
  IconEdit,
  IconChevronDown,
  IconChevronUp,
  IconCheck,
  IconX,
    IconPlus,
} from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { InternshipWithCompanyLocationSetUser } from "@/types/entities";
import { type ListResult } from "@/types/data";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { getInternshipKindLabel } from "@/data/lists";
import { useSession } from "next-auth/react";

type TInternshipsListProps = {};
type TInternshipsListState = {
  filterYear: number | undefined;
  filterCompany: number | undefined;
  filterCompanyName: string | undefined;
  filterClassname: string | undefined;
  order: string;
  page: number;
  size: number;
};

const STORAGE_ID = "internships-table";

const InternshipsList: FC = (TInternshipsTableProps) => {
  const searchParams = useSearchParams();
  const [filterOpened, { toggle: toggleFilter }] = useDisclosure(false);
  const { data: session, status } = useSession();
  const [loadTableState, storeTableState, removeTableState] =
    useSessionStorage<TInternshipsListState>(STORAGE_ID);
  const [data, setData] =
    useState<ListResult<InternshipWithCompanyLocationSetUser> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<TInternshipsListState>({
    filterYear: searchParams.get("year")
      ? parseInt(searchParams.get("year") as string)
      : undefined,
    filterCompany: searchParams.get("company")
      ? parseInt(searchParams.get("company") as string)
      : undefined,
    filterCompanyName: searchParams.get("companyName") ?? "",
    filterClassname: searchParams.get("classname") ?? "",
    order: searchParams.get("orderBy") ?? "created_desc",
    page: searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1,
    size: searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10,
  });
  const [deleteOpened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const fetchData = useCallback(
    (
      year: number | undefined,
      company: number | undefined,
      companyName: string | undefined,
      classname: string | undefined,
      orderBy: string,
      page: number = 1,
      pageSize: number = 10,
    ) => {
      fetch(
        `/api/internships?user=${session?.user.id}&year=${year !== undefined ? year : ""}&company=${company !== undefined ? company : ""}&companyName=${companyName}&class=${classname}&orderBy=${orderBy}&page=${page - 1}&size=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
        .then((response) => {
          if (!response.ok) {
            setData(null);
            setError("Došlo k chybě při získávání dat.");
            throw new Error("Došlo k chybě při získávání dat.");
          }
          return response.json();
        })
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {});
    },
    [],
  );

  useEffect(() => {
    let storedState = loadTableState();
    const searchedYear = searchParams.get("year")
      ? parseInt(searchParams.get("year") as string)
      : undefined;
    const searchedCompany = searchParams.get("company")
      ? parseInt(searchParams.get("company") as string)
      : undefined;
    const searchedCompanyName = searchParams.get("companyName") ?? "";
    const searchedClassname = searchParams.get("classname") ?? "";
    const orderBy = searchParams.get("orderBy") ?? "created_desc";
    const paginationPage = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const paginationSize = searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10;
    let URLState: TInternshipsListState = {
      filterYear: searchedYear,
      filterCompany: searchedCompany,
      filterCompanyName: searchedCompanyName,
      filterClassname: searchedClassname,
      order: orderBy,
      page: paginationPage,
      size: paginationSize,
    };
    setState({ ...URLState });
  }, [searchParams, loadTableState]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    state.filterYear !== undefined &&
      params.set("year", String(state.filterYear));
    state.filterCompany !== undefined &&
      params.set("company", String(state.filterCompany));
    state.filterCompanyName !== undefined &&
      params.set("companyName", state.filterCompanyName);
    state.filterClassname !== undefined &&
      params.set("classname", state.filterClassname);
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    params.set("orderBy", state.order);
    window.history.replaceState(null, "", `?${params.toString()}`);
    storeTableState(state);
    fetchData(
      state.filterYear,
      state.filterCompany,
      state.filterCompanyName,
      state.filterClassname,
      state.order,
      state.page,
      state.size,
    );
  }, [state, fetchData, searchParams, storeTableState]);

  return (
    <>
      <Box my="sm">
        <Group>
        <Button
          component={Link}
          href="/internships/create"
          variant="filled"
          leftSection={<IconPlus />}
        >
          Nová
        </Button>
        <Button onClick={toggleFilter} variant="default">Filtr</Button>
        </Group>
      </Box>
      <Collapse in={filterOpened}>
        <Group mt="xl" align="end">
          <TextInput
            label="Rok"
            value={state.filterYear}
            onChange={(event) => {
              setState({
                ...state,
                filterYear: event.currentTarget.value
                  ? parseInt(event.currentTarget.value)
                  : undefined,
                page: 1,
              });
            }}
            placeholder="2024"
          />
          <TextInput
            label="Firma"
            value={state.filterCompanyName}
            onChange={(event) => {
              setState({
                ...state,
                filterCompanyName: event.currentTarget.value,
                page: 1,
              });
            }}
            placeholder="Arasaka"
          />
          <TextInput
            label="Třída"
            value={state.filterClassname}
            onChange={(event) => {
              setState({
                ...state,
                filterClassname: event.currentTarget.value,
                page: 1,
              });
            }}
            placeholder="P2A"
          />
          <Button onClick={(event) => {
                  setState({
                    ...state,
                    filterYear: undefined,
                    filterCompany: undefined,
                    filterCompanyName: "",
                    filterClassname: "",
                    order: "created_desc",
                    page: 1,
                  });
                }}>Vše</Button>
        </Group>
        </Collapse>
                <Box mt="lg">
                {data && data.total === 0 && (
              <Alert>
                Žádná praxe nevyhovuje podmínkám.
              </Alert>
          )}   
          {data && data.data.map((internship, index) => (
            <Link key={index} href={"/internship/" + internship.id}>
            <Paper >
                <Title order={3}>{internship.company.name} ({internship.set.year})</Title>
                <Grid>

                </Grid>
            </Paper>
            </Link>
          ))}
                </Box>
      <Flex justify="center">
        <Pagination
          total={Math.ceil((data?.total ?? 0) / (data?.size ?? 10))}
          value={(data?.page ?? 1) + 1}
          onChange={(page) =>
            /*setPage(page)*/ setState({ ...state, page: page })
          }
        />
      </Flex>
      <Modal
        opened={deleteOpened}
        centered
        onClose={close}
        size="auto"
        title="Odstranění praxe"
        fullScreen={isMobile}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <Text>Opravdu si přejete tuto praxi odstranit?</Text>
        <Text fw={700}>Data pak už nebude možné obnovit.</Text>
        <Group mt="xl">
          <Button
            onClick={() => {
              if (deleteId !== null) {
                fetch("/api/internships/" + deleteId, {
                  method: "DELETE",
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                    notifications.show({
                      title: "Povedlo se!",
                      message: "Praxe byla odstraněna.",
                      color: "lime",
                    });
                    fetchData(
                      state.filterYear,
                      state.filterCompany,
                      state.filterCompanyName,
                      state.filterClassname,
                      state.order,
                      state.page,
                      state.size,
                    );
                  })
                  .catch((error) => {
                    notifications.show({
                      title: "Chyba!",
                      message: "Smazání praxe nebylo úspěšné.",
                      color: "red",
                    });
                  })
                  .finally(() => {
                    close();
                  });
              }
            }}
            color="red"
            leftSection={<IconTrash />}
          >
            Smazat
          </Button>
          <Button onClick={close} variant="default">
            Storno
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default InternshipsList;