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
} from "@mantine/core";
import {
  IconInfoSmall,
  IconTrash,
  IconEdit,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Location } from "@prisma/client";
import { type ListResult } from "@/types/data";
import { useSessionStorage } from "@/hooks/useSessionStorage";

type TLocationsTableProps = {};
type TLocationsTableState = {
  filterCountry: string;
  filterMunicipality: string;
  filterStreet: string;
  order: string;
  page: number;
  size: number;
};

const STORAGE_ID = "locations-table";

const LocationsTable: FC = (TLocationsTableProps) => {
  const searchParams = useSearchParams();
  const [loadTableState, storeTableState, removeTableState] =
    useSessionStorage<TLocationsTableState>(STORAGE_ID);
  const [data, setData] = useState<ListResult<Location> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<TLocationsTableState>({
    filterMunicipality: "",
    filterCountry: "",
    filterStreet: "",
    order: "municipality",
    page: 1,
    size: 10,
  });
  const [deleteOpened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const fetchData = useCallback(
    (
      country: string | undefined,
      municipality: string | undefined,
      street: string | undefined,
      orderBy: string,
      page: number = 1,
      pageSize: number = 10,
    ) => {
      fetch(
        `/api/locations?country=${country}&municipality=${municipality}&street=${street}&orderBy=${orderBy}&page=${page - 1}&size=${pageSize}`,
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
    const searchedCountry = searchParams.get("country") ?? "";
    const searchedMunicipality = searchParams.get("municipality") ?? "";
    const searchedStreet = searchParams.get("street") ?? "";
    const orderBy = searchParams.get("orderBy") ?? "municipality";
    const paginationPage = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const paginationSize = searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10;
    let URLState: TLocationsTableState = {
      filterCountry: searchedCountry,
      filterMunicipality: searchedMunicipality,
      filterStreet: searchedStreet,
      order: orderBy,
      page: paginationPage,
      size: paginationSize,
    };
    setState({ ...URLState });
  }, [searchParams, loadTableState]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    state.filterCountry !== undefined &&
      params.set("country", state.filterCountry);
    state.filterMunicipality !== undefined &&
      params.set("municipality", state.filterMunicipality);
    state.filterStreet !== undefined &&
      params.set("street", state.filterStreet);
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    params.set("orderBy", state.order);
    window.history.replaceState(null, "", `?${params.toString()}`);
    storeTableState(state);
    fetchData(
      state.filterCountry,
      state.filterMunicipality,
      state.filterStreet,
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
                  let newOrder =
                    state.order === "street" ? "street_desc" : "street";
                  setState({ ...state, order: newOrder });
                }}
                style={{ cursor: "pointer" }}
              >
                Ulice{" "}
                {state.order === "street" ? (
                  <IconChevronDown size={12} />
                ) : state.order === "street_desc" ? (
                  <IconChevronUp size={12} />
                ) : null}
              </Text>
            </Table.Th>
            <Table.Th>
              <Text fw={700}>Č.p.</Text>
            </Table.Th>
            <Table.Th>
              <Text
                fw={700}
                onClick={() => {
                  let newOrder =
                    state.order === "municipality"
                      ? "municipality_desc"
                      : "municipality";
                  setState({ ...state, order: newOrder });
                }}
                style={{ cursor: "pointer" }}
              >
                Obec{" "}
                {state.order === "municipality" ? (
                  <IconChevronDown size={12} />
                ) : state.order === "municipality_desc" ? (
                  <IconChevronUp size={12} />
                ) : null}
              </Text>
            </Table.Th>
            <Table.Th>
              <Text
                fw={700}
                onClick={() => {
                  let newOrder =
                    state.order === "country" ? "country_desc" : "country";
                  setState({ ...state, order: newOrder });
                }}
                style={{ cursor: "pointer" }}
              >
                Stát{" "}
                {state.order === "country" ? (
                  <IconChevronDown size={12} />
                ) : state.order === "country_desc" ? (
                  <IconChevronUp size={12} />
                ) : null}
              </Text>
            </Table.Th>
            <Table.Th>Možnosti</Table.Th>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterStreet}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterStreet: event.currentTarget.value,
                    page: 1,
                  });
                }}
              />
            </Table.Th>
            <Table.Th></Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterMunicipality}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterMunicipality: event.currentTarget.value,
                    page: 1,
                  });
                }}
              />
            </Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterCountry}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterCountry: event.currentTarget.value,
                    page: 1,
                  });
                }}
              />
            </Table.Th>
            <Table.Th>
              <Button
                size="xs"
                onClick={(event) => {
                  setState({
                    ...state,
                    filterStreet: "",
                    filterMunicipality: "",
                    filterCountry: "",
                    order: "text",
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
                Žádné místo nevyhovuje podmínkám.
              </Table.Td>
            </Table.Tr>
          )}
          {data &&
            data.data.map((location) => (
              <Table.Tr key={location.id}>
                <Table.Td>
                  <Text>{location.street}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{location.descNo}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{location.municipality}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{location.country}</Text>
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={"/dashboard/locations/" + location.id}
                  >
                    <IconInfoSmall />
                  </ActionIcon>{" "}
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => {
                      setDeleteId(location.id);
                      open();
                    }}
                  >
                    <IconTrash />
                  </ActionIcon>{" "}
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={"/dashboard/locations/" + location.id + "/edit"}
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
        title="Odstranění místa"
        fullScreen={isMobile}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <Text>Opravdu si přejete toto místo odstranit?</Text>
        <Text fw={700}>Data pak už nebude možné obnovit.</Text>
        <Group mt="xl">
          <Button
            onClick={() => {
              if (deleteId !== null) {
                fetch("/api/locations/" + deleteId, {
                  method: "DELETE",
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                    notifications.show({
                      title: "Povedlo se!",
                      message: "Místo bylo odstraněno.",
                      color: "lime",
                    });
                    fetchData(
                      state.filterCountry,
                      state.filterMunicipality,
                      state.filterStreet,
                      state.order,
                      state.page,
                      state.size,
                    );
                  })
                  .catch((error) => {
                    notifications.show({
                      title: "Chyba!",
                      message: "Smazání místa nebylo úspěšné.",
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

export default LocationsTable;
