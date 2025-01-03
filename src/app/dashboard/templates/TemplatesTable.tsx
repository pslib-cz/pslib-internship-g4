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
import { Template } from "@prisma/client";
import { type ListResult } from "@/types/data";

type TTemplatesTableProps = {};
type TTemplatesTableState = {
  filterName: string;
  order: string;
  page: number;
  size: number;
};

const TemplatesTable: FC<TTemplatesTableProps> = () => {
  const searchParams = useSearchParams();
  const { pageSize: generalPageSize } = useContext(AccountDrawerContext);

  const initialState: TTemplatesTableState = {
    filterName: searchParams.get("name") ?? "",
    order: searchParams.get("orderBy") ?? "name",
    page: parseInt(searchParams.get("page") ?? "1"),
    size: parseInt(searchParams.get("size") ?? `${generalPageSize}`),
  };

  const [state, setState] = useState<TTemplatesTableState>(initialState);
  const [data, setData] = useState<ListResult<Template> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteOpened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (state.filterName) params.set("name", state.filterName);
    params.set("orderBy", state.order);
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [state]);

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      name: state.filterName,
      orderBy: state.order,
      page: (state.page - 1).toString(),
      size: state.size.toString(),
    });

    fetch(`/api/templates?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Došlo k chybě při načítání dat.");
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
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
              <Button
                size="xs"
                onClick={() =>
                  setState({
                    filterName: "",
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
          {loading && (
            <Table.Tr>
              <Table.Td colSpan={2}>
                <Text>Načítám data...</Text>
              </Table.Td>
            </Table.Tr>
          )}
          {error && (
            <Table.Tr>
              <Table.Td colSpan={2}>
                <Alert color="red">{error}</Alert>
              </Table.Td>
            </Table.Tr>
          )}
          {data?.data.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={2}>
                Žádná šablona nevyhovuje podmínkám.
              </Table.Td>
            </Table.Tr>
          )}
          {data?.data.map((template) => (
            <Table.Tr key={template.id}>
              <Table.Td>{template.name}</Table.Td>
              <Table.Td>
                <ActionIcon
                  variant="light"
                  component={Link}
                  href={`/dashboard/templates/${template.id}`}
                >
                  <IconInfoSmall />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => {
                    setDeleteId(template.id);
                    open();
                  }}
                >
                  <IconTrash />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  component={Link}
                  href={`/dashboard/templates/${template.id}/edit`}
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
        title="Odstranění šablony"
        centered
        size="auto"
      >
        <Text>Opravdu chcete tuto šablonu odstranit?</Text>
        <Group mt="md">
          <Button
            color="red"
            onClick={() => {
              if (deleteId) {
                fetch(`/api/templates/${deleteId}`, { method: "DELETE" })
                  .then(() => {
                    notifications.show({
                      title: "Úspěch",
                      message: "Šablona byla odstraněna.",
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

export default TemplatesTable;
