"use client";

import React, { FC, useEffect, useState, useCallback, useContext } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Table,
  Button,
  ActionIcon,
  TextInput,
  Modal,
  Group,
  Alert,
  Pagination,
  Flex,
  Text,
} from "@mantine/core";
import { IconTrash, IconEdit, IconInfoSmall } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { AccountDrawerContext } from "@/providers/AccountDrawerProvider";
import { SortableHeader } from "@/components";
import { type ListResult } from "@/types/data";
import { Location } from "@prisma/client";

type TLocationsTableProps = {};
type TLocationsTableState = {
  filterCountry: string;
  filterMunicipality: string;
  filterStreet: string;
  order: string;
  page: number;
  size: number;
};

const LocationsTable: FC<TLocationsTableProps> = () => {
  const searchParams = useSearchParams();
  const { pageSize: generalPageSize } = useContext(AccountDrawerContext);

  const [data, setData] = useState<ListResult<Location> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initialState: TLocationsTableState = {
    filterCountry: searchParams.get("country") ?? "",
    filterMunicipality: searchParams.get("municipality") ?? "",
    filterStreet: searchParams.get("street") ?? "",
    order: searchParams.get("orderBy") ?? "municipality",
    page: parseInt(searchParams.get("page") ?? "1"),
    size: parseInt(searchParams.get("size") ?? `${generalPageSize}`),
  };

  const [state, setState] = useState<TLocationsTableState>(initialState);
  const [deleteOpened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (state.filterCountry) params.set("country", state.filterCountry);
    if (state.filterMunicipality)
      params.set("municipality", state.filterMunicipality);
    if (state.filterStreet) params.set("street", state.filterStreet);
    params.set("orderBy", state.order);
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [state]);

  const fetchData = useCallback(() => {
    const params = new URLSearchParams({
      country: state.filterCountry,
      municipality: state.filterMunicipality,
      street: state.filterStreet,
      orderBy: state.order,
      page: (state.page - 1).toString(),
      size: state.size.toString(),
    });

    fetch(`/api/locations?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Došlo k chybě při získávání dat.");
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => setError(error.message));
  }, [state]);

  useEffect(() => {
    updateURL();
    fetchData();
  }, [state, updateURL, fetchData]);

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <SortableHeader
                label="Ulice"
                currentOrder={state.order}
                columnKey="street"
                onSort={(newOrder) => setState({ ...state, order: newOrder })}
              />
            </Table.Th>
            <Table.Th>Č.p.</Table.Th>
            <Table.Th>
              <SortableHeader
                label="Obec"
                currentOrder={state.order}
                columnKey="municipality"
                onSort={(newOrder) => setState({ ...state, order: newOrder })}
              />
            </Table.Th>
            <Table.Th>
              <SortableHeader
                label="Stát"
                currentOrder={state.order}
                columnKey="country"
                onSort={(newOrder) => setState({ ...state, order: newOrder })}
              />
            </Table.Th>
            <Table.Th>Možnosti</Table.Th>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterStreet}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterStreet: event.currentTarget.value,
                    page: 1,
                  })
                }
              />
            </Table.Th>
            <Table.Th></Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterMunicipality}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterMunicipality: event.currentTarget.value,
                    page: 1,
                  })
                }
              />
            </Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterCountry}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterCountry: event.currentTarget.value,
                    page: 1,
                  })
                }
              />
            </Table.Th>
            <Table.Th>
              <Button
                size="xs"
                onClick={() =>
                  setState({
                    filterStreet: "",
                    filterMunicipality: "",
                    filterCountry: "",
                    order: "municipality",
                    page: 1,
                    size: generalPageSize,
                  })
                }
              >
                Vše
              </Button>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {error && (
            <Table.Tr>
              <Table.Td colSpan={5}>
                <Alert color="red">{error}</Alert>
              </Table.Td>
            </Table.Tr>
          )}
          {data?.data.map((location) => (
            <Table.Tr key={location.id}>
              <Table.Td>{location.street}</Table.Td>
              <Table.Td>{location.descNo}</Table.Td>
              <Table.Td>{location.municipality}</Table.Td>
              <Table.Td>{location.country}</Table.Td>
              <Table.Td>
                <ActionIcon
                  variant="light"
                  component={Link}
                  href={`/dashboard/locations/${location.id}`}
                >
                  <IconInfoSmall />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => {
                    setDeleteId(location.id);
                    open();
                  }}
                >
                  <IconTrash />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  component={Link}
                  href={`/dashboard/locations/${location.id}/edit`}
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
          total={Math.ceil(
            (data?.total ?? 0) / (data?.size ?? generalPageSize),
          )}
          value={state.page}
          onChange={(page) => setState({ ...state, page })}
        />
      </Flex>
      <Modal
        opened={deleteOpened}
        onClose={close}
        title="Odstranění místa"
        centered
        size="auto"
      >
        <Text>Opravdu si přejete toto místo odstranit?</Text>
        <Group mt="md">
          <Button
            color="red"
            onClick={() => {
              if (deleteId) {
                fetch(`/api/locations/${deleteId}`, { method: "DELETE" })
                  .then(() => {
                    notifications.show({
                      title: "Úspěch",
                      message: "Místo bylo odstraněno.",
                      color: "green",
                    });
                    fetchData();
                  })
                  .catch(() =>
                    notifications.show({
                      title: "Chyba",
                      message: "Odstranění selhalo.",
                      color: "red",
                    }),
                  )
                  .finally(() => {
                    close();
                    setDeleteId(null);
                  });
              }
            }}
          >
            Smazat
          </Button>
          <Button onClick={close}>Zrušit</Button>
        </Group>
      </Modal>
    </>
  );
};

export default LocationsTable;
