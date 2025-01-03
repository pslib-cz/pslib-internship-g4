"use client";

import React, { FC, useEffect, useState, useCallback, useContext } from "react";
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
  IconTrash,
  IconEdit,
  IconInfoSmall,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { AccountDrawerContext } from "@/providers/AccountDrawerProvider";
import { SortableHeader } from "@/components";
import { type ListResult } from "@/types/data";
import { Set } from "@prisma/client";

type TSetsTableProps = {};
type TSetsTableState = {
  filterName: string;
  filterYear: string;
  filterActive: string;
  filterContinuous: string;
  order: string;
  page: number;
  size: number;
};

const SetsTable: FC<TSetsTableProps> = () => {
  const searchParams = useSearchParams();
  const { pageSize: generalPageSize } = useContext(AccountDrawerContext);

  const initialState: TSetsTableState = {
    filterName: searchParams.get("name") ?? "",
    filterYear: searchParams.get("year") ?? "",
    filterActive: searchParams.get("active") ?? "",
    filterContinuous: searchParams.get("continuous") ?? "",
    order: searchParams.get("orderBy") ?? "name",
    page: parseInt(searchParams.get("page") ?? "1"),
    size: parseInt(searchParams.get("size") ?? `${generalPageSize}`),
  };

  const [state, setState] = useState<TSetsTableState>(initialState);
  const [data, setData] = useState<ListResult<Set> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (state.filterName) params.set("name", state.filterName);
    if (state.filterYear) params.set("year", state.filterYear);
    if (state.filterActive) params.set("active", state.filterActive);
    if (state.filterContinuous)
      params.set("continuous", state.filterContinuous);
    params.set("orderBy", state.order);
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [state]);

  const fetchData = useCallback(() => {
    const params = new URLSearchParams({
      name: state.filterName,
      year: state.filterYear,
      active: state.filterActive,
      continuous: state.filterContinuous,
      orderBy: state.order,
      page: (state.page - 1).toString(),
      size: state.size.toString(),
    });

    fetch(`/api/sets?${params.toString()}`)
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
                label="Název"
                currentOrder={state.order}
                columnKey="name"
                onSort={(newOrder) => setState({ ...state, order: newOrder })}
              />
            </Table.Th>
            <Table.Th>
              <SortableHeader
                label="Rok"
                currentOrder={state.order}
                columnKey="year"
                onSort={(newOrder) => setState({ ...state, order: newOrder })}
              />
            </Table.Th>
            <Table.Th>Aktivní</Table.Th>
            <Table.Th>Průběžná</Table.Th>
            <Table.Th>Možnosti</Table.Th>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>
              <TextInput
                size="xs"
                placeholder="Název"
                value={state.filterName}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterName: event.currentTarget.value,
                    page: 1,
                  })
                }
              />
            </Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                placeholder="Rok"
                value={state.filterYear}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterYear: event.currentTarget.value,
                    page: 1,
                  })
                }
              />
            </Table.Th>
            <Table.Th>
              <NativeSelect
                size="xs"
                value={state.filterActive}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterActive: event.currentTarget.value,
                    page: 1,
                  })
                }
                data={[
                  { label: "Vše", value: "" },
                  { label: "Ano", value: "true" },
                  { label: "Ne", value: "false" },
                ]}
              />
            </Table.Th>
            <Table.Th>
              <NativeSelect
                size="xs"
                value={state.filterContinuous}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterContinuous: event.currentTarget.value,
                    page: 1,
                  })
                }
                data={[
                  { label: "Vše", value: "" },
                  { label: "Ano", value: "true" },
                  { label: "Ne", value: "false" },
                ]}
              />
            </Table.Th>
            <Table.Th>
              <Button
                size="xs"
                onClick={() =>
                  setState({
                    filterName: "",
                    filterYear: "",
                    filterActive: "",
                    filterContinuous: "",
                    order: "name",
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
          {data?.data.map((set) => (
            <Table.Tr key={set.id}>
              <Table.Td>{set.name}</Table.Td>
              <Table.Td>{set.year}</Table.Td>
              <Table.Td>{set.active ? <IconCheck /> : <IconX />}</Table.Td>
              <Table.Td>{set.continuous ? <IconCheck /> : <IconX />}</Table.Td>
              <Table.Td>
                <ActionIcon
                  variant="light"
                  component={Link}
                  href={`/dashboard/sets/${set.id}`}
                >
                  <IconInfoSmall />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => {
                    setDeleteId(set.id);
                    open();
                  }}
                >
                  <IconTrash />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  component={Link}
                  href={`/dashboard/sets/${set.id}/edit`}
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
        title="Odstranění sady"
        centered
        size="auto"
      >
        <Text>Opravdu chcete tuto sadu odstranit?</Text>
        <Group mt="md">
          <Button
            color="red"
            onClick={() => {
              if (deleteId) {
                fetch(`/api/sets/${deleteId}`, { method: "DELETE" })
                  .then(() => {
                    notifications.show({
                      title: "Úspěch",
                      message: "Sada byla odstraněna.",
                      color: "green",
                    });
                    fetchData();
                  })
                  .catch(() =>
                    notifications.show({
                      title: "Chyba",
                      message: "Odstranění se nezdařilo.",
                      color: "red",
                    }),
                  )
                  .finally(() => close());
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

export default SetsTable;
