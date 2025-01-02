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
  NativeSelect,
  Text,
} from "@mantine/core";
import { IconTrash, IconEdit, IconInfoSmall } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { AccountDrawerContext } from "@/providers/AccountDrawerProvider";
import { SortableHeader } from "@/components";
import { TextWithAuthor } from "@/types/entities";
import { type ListResult } from "@/types/data";
import { getPublicationTargetLabel, publicationTargets } from "@/data/lists";

type TTextsTableProps = {};
type TTextsTableState = {
  filterTitle: string;
  filterPublished: number | null;
  order: string;
  page: number;
  size: number;
};

const TextsTable: FC<TTextsTableProps> = () => {
  const searchParams = useSearchParams();
  const { pageSize: generalPageSize } = useContext(AccountDrawerContext);

  const initialState: TTextsTableState = {
    filterTitle: searchParams.get("title") ?? "",
    filterPublished: searchParams.get("published")
      ? parseInt(searchParams.get("published") as string)
      : null,
    order: searchParams.get("orderBy") ?? "title",
    page: parseInt(searchParams.get("page") ?? "1"),
    size: parseInt(searchParams.get("size") ?? `${generalPageSize}`),
  };

  const [state, setState] = useState<TTextsTableState>(initialState);
  const [data, setData] = useState<ListResult<TextWithAuthor> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteOpened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (state.filterTitle) params.set("title", state.filterTitle);
    if (state.filterPublished !== null)
      params.set("published", state.filterPublished.toString());
    params.set("orderBy", state.order);
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [state]);

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      title: state.filterTitle,
      published: state.filterPublished?.toString() ?? "",
      orderBy: state.order,
      page: (state.page - 1).toString(),
      size: state.size.toString(),
    });

    fetch(`/api/texts?${params.toString()}`)
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
                label="Titulek"
                currentOrder={state.order}
                columnKey="title"
                onSort={(newOrder) => setState({ ...state, order: newOrder })}
              />
            </Table.Th>
            <Table.Th>
              <SortableHeader
                label="Umístění"
                currentOrder={state.order}
                columnKey="published"
                onSort={(newOrder) => setState({ ...state, order: newOrder })}
              />
            </Table.Th>
            <Table.Th>Možnosti</Table.Th>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>
              <TextInput
                size="xs"
                placeholder="Titulek"
                value={state.filterTitle}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterTitle: event.currentTarget.value,
                    page: 1,
                  })
                }
              />
            </Table.Th>
            <Table.Th>
              <NativeSelect
                size="xs"
                value={state.filterPublished?.toString() ?? ""}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterPublished: event.currentTarget.value
                      ? parseInt(event.currentTarget.value)
                      : null,
                    page: 1,
                  })
                }
                data={[{ label: "Vše", value: "" }, ...publicationTargets]}
              />
            </Table.Th>
            <Table.Th>
              <Button
                size="xs"
                onClick={() =>
                  setState({
                    filterTitle: "",
                    filterPublished: null,
                    order: "title",
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
              <Table.Td colSpan={3}>Načítám data...</Table.Td>
            </Table.Tr>
          )}
          {error && (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Alert color="red">{error}</Alert>
              </Table.Td>
            </Table.Tr>
          )}
          {data?.data.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={3}>Žádný text nevyhovuje podmínkám.</Table.Td>
            </Table.Tr>
          )}
          {data?.data.map((txt) => (
            <Table.Tr key={txt.id}>
              <Table.Td>{txt.title}</Table.Td>
              <Table.Td>{getPublicationTargetLabel(String(txt.published))}</Table.Td>
              <Table.Td>
                <ActionIcon
                  variant="light"
                  component={Link}
                  href={`/dashboard/texts/${txt.id}`}
                >
                  <IconInfoSmall />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => {
                    setDeleteId(txt.id);
                    open();
                  }}
                >
                  <IconTrash />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  component={Link}
                  href={`/dashboard/texts/${txt.id}/edit`}
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
          total={Math.ceil((data?.total ?? 0) / (data?.size ?? generalPageSize))}
          value={state.page}
          onChange={(page) => setState({ ...state, page })}
        />
      </Flex>
      <Modal
        opened={deleteOpened}
        onClose={close}
        title="Odstranění textu"
        centered
      >
        <Text>Opravdu chcete tento text odstranit?</Text>
        <Group mt="md">
          <Button
            color="red"
            onClick={() => {
              if (deleteId) {
                fetch(`/api/texts/${deleteId}`, { method: "DELETE" })
                  .then(() => {
                    notifications.show({
                      title: "Úspěch",
                      message: "Text byl odstraněn.",
                      color: "green",
                    });
                    fetchData();
                  })
                  .catch(() =>
                    notifications.show({
                      title: "Chyba",
                      message: "Odstranění se nezdařilo.",
                      color: "red",
                    })
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

export default TextsTable;