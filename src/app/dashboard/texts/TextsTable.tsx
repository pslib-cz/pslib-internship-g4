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
} from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Text as TextEntity } from "@prisma/client";
import { TextWithAuthor } from "@/types/entities";
import { type ListResult } from "@/types/data";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { getPublicationTargetLabel, publicationTargets } from "@/data/lists";

type TTextsTableProps = {};
type TTextsTableState = {
  filterTitle: string;
  filterPublished: number | null;
  order: string;
  page: number;
  size: number;
};

const STORAGE_ID = "texts-table";

const TextsTable: FC = (TTextsTableProps) => {
  const searchParams = useSearchParams();
  const [loadTableState, storeTableState, removeTableState] =
    useSessionStorage<TTextsTableState>(STORAGE_ID);
  const [data, setData] = useState<ListResult<TextWithAuthor> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<TTextsTableState>({
    filterTitle: "",
    filterPublished: null,
    order: "title",
    page: 1,
    size: 10,
  });
  const [deleteOpened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const fetchData = useCallback(
    (
      title: string | undefined,
      published: number | null,
      orderBy: string,
      page: number = 1,
      pageSize: number = 10,
    ) => {
      fetch(
        `/api/texts?title=${title}&published=${published ?? ""}&orderBy=${orderBy}&page=${page - 1}&size=${pageSize}`,
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
    const searchedTitle = searchParams.get("title") ?? "";
    const searchedPublished = searchParams.get("published") ?? "";
    const orderBy = searchParams.get("orderBy") ?? "title";
    const paginationPage = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const paginationSize = searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10;
    let URLState: TTextsTableState = {
      filterTitle: searchedTitle,
      filterPublished: searchedPublished ? parseInt(searchedPublished) : null,
      order: orderBy,
      page: paginationPage,
      size: paginationSize,
    };
    setState({ ...URLState });
  }, [searchParams, loadTableState]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    state.filterTitle !== undefined && params.set("title", state.filterTitle);
    state.filterPublished !== null &&
      params.set("published", state.filterPublished.toString());
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    params.set("orderBy", state.order);
    window.history.replaceState(null, "", `?${params.toString()}`);
    storeTableState(state);
    fetchData(
      state.filterTitle,
      state.filterPublished,
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
                    state.order === "title" ? "title_desc" : "title";
                  setState({ ...state, order: newOrder });
                }}
                style={{ cursor: "pointer" }}
              >
                Titulek{" "}
                {state.order === "title" ? (
                  <IconChevronDown size={12} />
                ) : state.order === "title_desc" ? (
                  <IconChevronUp size={12} />
                ) : null}
              </Text>
            </Table.Th>
            <Table.Th>
              <Text
                fw={700}
                onClick={() => {
                  let newOrder =
                    state.order === "published"
                      ? "published_desc"
                      : "published";
                  setState({ ...state, order: newOrder });
                }}
                style={{ cursor: "pointer" }}
              >
                Umístění{" "}
                {state.order === "published" ? (
                  <IconChevronDown size={12} />
                ) : state.order === "published_desc" ? (
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
                value={state.filterTitle}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterTitle: event.currentTarget.value,
                    page: 1,
                  });
                }}
              />
            </Table.Th>
            <Table.Th>
              <NativeSelect
                size="xs"
                value={state.filterPublished ?? ""}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterPublished: event.currentTarget.value
                      ? Number(event.currentTarget.value)
                      : null,
                    page: 1,
                  });
                }}
                data={[{ label: "Vše", value: "" }, ...publicationTargets]}
              />
            </Table.Th>
            <Table.Th>
              <Button
                size="xs"
                onClick={(event) => {
                  setState({
                    ...state,
                    filterTitle: "",
                    order: "title",
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
                Žádný text nevyhovuje podmínkám.
              </Table.Td>
            </Table.Tr>
          )}
          {data &&
            data.data.map((txt) => (
              <Table.Tr key={txt.id}>
                <Table.Td>
                  <Text>{txt.title}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>
                    {getPublicationTargetLabel(String(txt.published))}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={"/dashboard/texts/" + txt.id}
                  >
                    <IconInfoSmall />
                  </ActionIcon>{" "}
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => {
                      setDeleteId(txt.id);
                      open();
                    }}
                  >
                    <IconTrash />
                  </ActionIcon>{" "}
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={"/dashboard/texts/" + txt.id + "/edit"}
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
        title="Odstranění textu"
        fullScreen={isMobile}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <Text>Opravdu si přejete tento text odstranit?</Text>
        <Text fw={700}>Data pak už nebude možné obnovit.</Text>
        <Group mt="xl">
          <Button
            onClick={() => {
              if (deleteId !== null) {
                fetch("/api/text/" + deleteId, {
                  method: "DELETE",
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                    notifications.show({
                      title: "Povedlo se!",
                      message: "Text byl odstraněn.",
                      color: "lime",
                    });
                    fetchData(
                      state.filterTitle,
                      state.filterPublished,
                      state.order,
                      state.page,
                      state.size,
                    );
                  })
                  .catch((error) => {
                    notifications.show({
                      title: "Chyba!",
                      message: "Smazání textu nebylo úspěšné.",
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

export default TextsTable;
