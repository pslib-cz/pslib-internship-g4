"use client";

import React, { FC, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Table,
  Button,
  ActionIcon,
  Text,
  TextInput,
  Modal,
  Group,
  Alert,
  Pagination,
  Flex,
  NativeSelect,
} from "@mantine/core";
import {
  IconInfoSmall,
  IconTrash,
  IconEdit,
  IconChevronDown,
  IconChevronUp,
  IconCheck,
  IconChecks,
  IconX,
} from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Set } from "@prisma/client";
import { type ListResult } from "@/types/data";
import { useSessionStorage } from "@/hooks/useSessionStorage";

type TSetsTableProps = {};
type TSetsTableState = {
  filterName: string | undefined;
  filterYear: number | undefined;
  filterActive: boolean | undefined;
  filterContinuous: boolean | undefined;
  order: string;
  page: number;
  size: number;
};

const STORAGE_ID = "locations-table";

const SetsTable: FC = (TSetsTableProps) => {
  const searchParams = useSearchParams();
  const [loadTableState, storeTableState, removeTableState] =
    useSessionStorage<TSetsTableState>(STORAGE_ID);
  const [data, setData] = useState<ListResult<Set> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<TSetsTableState>({
    filterName: "",
    filterActive: undefined,
    filterContinuous: undefined,
    filterYear: undefined,
    order: "name",
    page: 1,
    size: 10,
  });
  const [deleteOpened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const fetchData = useCallback(
    (
      name: string | undefined,
      year: number | undefined,
      active: boolean | undefined,
      continuous: boolean | undefined,
      orderBy: string,
      page: number = 1,
      pageSize: number = 10,
    ) => {
      fetch(
        `/api/sets?name=${name}&year=${year === undefined ? "" : year}&active=${active === undefined ? "" : active}&continuous=${continuous === undefined ? "" : continuous}&orderBy=${orderBy}&page=${page - 1}&size=${pageSize}`,
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
    const searchedName = searchParams.get("name") ?? "";
    const searchedYear = searchParams.get("year") ?? "";
    const orderBy = searchParams.get("orderBy") ?? "name";
    const paginationPage = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const paginationSize = searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10;
    let URLState: TSetsTableState = {
      filterName: searchedName,
      filterActive: storedState?.filterActive,
      filterContinuous: storedState?.filterContinuous,
      filterYear: searchedYear ? parseInt(searchedYear) : undefined,
      order: orderBy,
      page: paginationPage,
      size: paginationSize,
    };
    setState({ ...URLState });
  }, [searchParams, loadTableState]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    state.filterName !== undefined && params.set("name", state.filterName);
    state.filterYear !== undefined &&
      params.set("year", state.filterYear.toString());
    state.filterActive === undefined
      ? params.set("active", "")
      : params.set("active", state.filterActive === true ? "true" : "false");
    state.filterContinuous === undefined
      ? params.set("continuous", "")
      : params.set(
          "continuous",
          state.filterContinuous === true ? "true" : "false",
        );
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    params.set("orderBy", state.order);
    window.history.replaceState(null, "", `?${params.toString()}`);
    storeTableState(state);
    fetchData(
      state.filterName,
      state.filterYear,
      state.filterActive,
      state.filterContinuous,
      state.order,
      state.page,
      state.size,
    );
  }, [state, fetchData, searchParams, storeTableState]);

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Text
                fw={700}
                onClick={() => {
                  let newOrder = state.order === "name" ? "name_desc" : "name";
                  setState({ ...state, order: newOrder });
                }}
                style={{ cursor: "pointer" }}
              >
                Název{" "}
                {state.order === "name" ? (
                  <IconChevronDown size={12} />
                ) : state.order === "name_desc" ? (
                  <IconChevronUp size={12} />
                ) : null}
              </Text>
            </Table.Th>
            <Table.Th>
              <Text
                fw={700}
                onClick={() => {
                  let newOrder = state.order === "year" ? "year_desc" : "year";
                  setState({ ...state, order: newOrder });
                }}
                style={{ cursor: "pointer" }}
              >
                Rok{" "}
                {state.order === "year" ? (
                  <IconChevronDown size={12} />
                ) : state.order === "year_desc" ? (
                  <IconChevronUp size={12} />
                ) : null}
              </Text>
            </Table.Th>
            <Table.Th>
              <Text fw={700}>Aktivní</Text>
            </Table.Th>
            <Table.Th>
              <Text fw={700}>Průběžná</Text>
            </Table.Th>
            <Table.Th>Možnosti</Table.Th>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterName}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterName: event.currentTarget.value,
                    page: 1,
                  });
                }}
              />
            </Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterYear}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterYear:
                      event.currentTarget.value !== undefined
                        ? parseInt(event.currentTarget.value)
                        : undefined,
                    page: 1,
                  });
                }}
              />
            </Table.Th>
            <Table.Th>
              <NativeSelect
                size="xs"
                value={
                  state.filterActive === undefined
                    ? ""
                    : state.filterActive === true
                      ? "true"
                      : "false"
                }
                onChange={(event) =>
                  setState({
                    ...state,
                    filterActive:
                      event.currentTarget.value === ""
                        ? undefined
                        : event.currentTarget.value === "true"
                          ? true
                          : false,
                    page: 1,
                  })
                }
                data={[
                  { label: "Vše", value: "" },
                  { label: "Aktivní", value: "true" },
                  { label: "Zrušená", value: "false" },
                ]}
              />
            </Table.Th>
            <Table.Th>
              <NativeSelect
                size="xs"
                value={
                  state.filterContinuous === undefined
                    ? ""
                    : state.filterContinuous === true
                      ? "true"
                      : "false"
                }
                onChange={(event) =>
                  setState({
                    ...state,
                    filterContinuous:
                      event.currentTarget.value === ""
                        ? undefined
                        : event.currentTarget.value === "true"
                          ? true
                          : false,
                    page: 1,
                  })
                }
                data={[
                  { label: "Vše", value: "" },
                  { label: "Souvislá", value: "false" },
                  { label: "Průběžná", value: "true" },
                ]}
              />
            </Table.Th>
            <Table.Th>
              <Button
                size="xs"
                onClick={(event) => {
                  setState({
                    ...state,
                    filterName: "",
                    order: "name",
                    page: 1,
                  });
                }}
              >
                Vše
              </Button>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {error && (
            <Table.Tr>
              <Table.Td colSpan={100}>
                <Alert color="red">{error}</Alert>
              </Table.Td>
            </Table.Tr>
          )}
          {data && data.total === 0 && (
            <Table.Tr>
              <Table.Td colSpan={100}>
                Žádná sada nevyhovuje podmínkám.
              </Table.Td>
            </Table.Tr>
          )}
          {data &&
            data.data.map((set) => (
              <Table.Tr key={set.id}>
                <Table.Td>
                  <Text>{set.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{set.year}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>
                    {set.active ? (
                      set.editable ? (
                        <IconChecks />
                      ) : (
                        <IconCheck />
                      )
                    ) : (
                      <IconX />
                    )}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text>{set.continuous ? <IconCheck /> : <IconX />}</Text>
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={"/dashboard/sets/" + set.id}
                  >
                    <IconInfoSmall />
                  </ActionIcon>{" "}
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => {
                      setDeleteId(set.id);
                      open();
                    }}
                  >
                    <IconTrash />
                  </ActionIcon>{" "}
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={"/dashboard/sets/" + set.id + "/edit"}
                  >
                    <IconEdit />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
        </Table.Tbody>
      </Table>
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
        title="Odstranění sady"
        fullScreen={isMobile}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <Text>Opravdu si přejete tuto sadu odstranit?</Text>
        <Text fw={700}>Data pak už nebude možné obnovit.</Text>
        <Group mt="xl">
          <Button
            onClick={() => {
              if (deleteId !== null) {
                fetch("/api/sets/" + deleteId, {
                  method: "DELETE",
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                    notifications.show({
                      title: "Povedlo se!",
                      message: "Sada byla odstraněna.",
                      color: "lime",
                    });
                    fetchData(
                      state.filterName,
                      state.filterYear,
                      state.filterActive,
                      state.filterContinuous,
                      state.order,
                      state.page,
                      state.size,
                    );
                  })
                  .catch((error) => {
                    notifications.show({
                      title: "Chyba!",
                      message: "Smazání sady nebylo úspěšné.",
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

export default SetsTable;
