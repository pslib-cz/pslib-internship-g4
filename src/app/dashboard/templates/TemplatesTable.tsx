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
import { Template } from "@prisma/client";
import { type ListResult } from "@/types/data";
import { useSessionStorage } from "@/hooks/useSessionStorage";

type TTemplatesTableProps = {};
type TTemplatesTableState = {
  filterName: string;
  order: string;
  page: number;
  size: number;
};

const STORAGE_ID = "locations-table";

const TemplatesTable: FC = (TTemplatesTableProps) => {
  const searchParams = useSearchParams();
  const [loadTableState, storeTableState, removeTableState] =
    useSessionStorage<TTemplatesTableState>(STORAGE_ID);
  const [data, setData] = useState<ListResult<Template> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<TTemplatesTableState>({
    filterName: "",
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
      orderBy: string,
      page: number = 1,
      pageSize: number = 10,
    ) => {
      fetch(
        `/api/templates?name=${name}&orderBy=${orderBy}&page=${page - 1}&size=${pageSize}`,
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
    const orderBy = searchParams.get("orderBy") ?? "name";
    const paginationPage = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const paginationSize = searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10;
    let URLState: TTemplatesTableState = {
      filterName: searchedName,
      order: orderBy,
      page: paginationPage,
      size: paginationSize,
    };
    setState({ ...URLState });
  }, [searchParams, loadTableState]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    state.filterName !== undefined && params.set("name", state.filterName);
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    params.set("orderBy", state.order);
    window.history.replaceState(null, "", `?${params.toString()}`);
    storeTableState(state);
    fetchData(
      state.filterName,
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
                Žádná šablona nevyhovuje podmínkám.
              </Table.Td>
            </Table.Tr>
          )}
          {data &&
            data.data.map((template) => (
              <Table.Tr key={template.id}>
                <Table.Td>
                  <Text>{template.name}</Text>
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={"/dashboard/templates/" + template.id}
                  >
                    <IconInfoSmall />
                  </ActionIcon>{" "}
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => {
                      setDeleteId(template.id);
                      open();
                    }}
                  >
                    <IconTrash />
                  </ActionIcon>{" "}
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={"/dashboard/templates/" + template.id + "/edit"}
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
        title="Odstranění šablony"
        fullScreen={isMobile}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <Text>Opravdu si přejete tuto šablonu odstranit?</Text>
        <Text fw={700}>Data pak už nebude možné obnovit.</Text>
        <Group mt="xl">
          <Button
            onClick={() => {
              if (deleteId !== null) {
                fetch("/api/templates/" + deleteId, {
                  method: "DELETE",
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                    notifications.show({
                      title: "Povedlo se!",
                      message: "Šablona byla odstraněna.",
                      color: "lime",
                    });
                    fetchData(
                      state.filterName,
                      state.order,
                      state.page,
                      state.size,
                    );
                  })
                  .catch((error) => {
                    notifications.show({
                      title: "Chyba!",
                      message: "Smazání šablony nebylo úspěšné.",
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

export default TemplatesTable;
