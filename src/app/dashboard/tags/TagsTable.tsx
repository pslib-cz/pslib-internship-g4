"use client";

import React, { FC, useEffect, useState, useCallback, useContext } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Table,
  Button,
  ActionIcon,
  NativeSelect,
  Text,
  TextInput,
  Badge,
  Modal,
  Group,
  Alert,
  Pagination,
  Flex,
} from "@mantine/core";
import { IconTrash, IconEdit, IconInfoSmall } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { AccountDrawerContext } from "@/providers/AccountDrawerProvider";
import { SortableHeader } from "@/components";
import { Tag } from "@prisma/client";
import { tagTypes, getTagLabel } from "@/data/lists";
import { type ListResult } from "@/types/data";

type TTagsTableProps = {};
type TTagsTableState = {
  filterText: string;
  filterType: string;
  order: string;
  page: number;
  size: number;
};

const TagsTable: FC<TTagsTableProps> = () => {
  const searchParams = useSearchParams();
  const { pageSize: generalPageSize } = useContext(AccountDrawerContext);

  const initialState: TTagsTableState = {
    filterText: searchParams.get("text") ?? "",
    filterType: searchParams.get("type") ?? "",
    order: searchParams.get("orderBy") ?? "text",
    page: parseInt(searchParams.get("page") ?? "1"),
    size: parseInt(searchParams.get("size") ?? `${generalPageSize}`),
  };

  const [state, setState] = useState<TTagsTableState>(initialState);
  const [data, setData] = useState<ListResult<Tag> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteOpened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (state.filterText) params.set("text", state.filterText);
    if (state.filterType) params.set("type", state.filterType);
    params.set("orderBy", state.order);
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [state]);

  const fetchData = useCallback(() => {
    const params = new URLSearchParams({
      text: state.filterText,
      type: state.filterType,
      orderBy: state.order,
      page: (state.page - 1).toString(),
      size: state.size.toString(),
    });
    setLoading(true);
    fetch(`/api/tags?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Došlo k chybě při získávání dat.");
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
                label="Text"
                currentOrder={state.order}
                columnKey="text"
                onSort={(newOrder) => setState({ ...state, order: newOrder })}
              />
            </Table.Th>
            <Table.Th>
              <SortableHeader
                label="Typ"
                currentOrder={state.order}
                columnKey="type"
                onSort={(newOrder) => setState({ ...state, order: newOrder })}
              />
            </Table.Th>
            <Table.Th>Náhled</Table.Th>
            <Table.Th>Možnosti</Table.Th>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>
              <TextInput
                size="xs"
                placeholder="Text"
                value={state.filterText}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterText: event.currentTarget.value,
                    page: 1,
                  })
                }
              />
            </Table.Th>
            <Table.Th>
              <NativeSelect
                size="xs"
                value={state.filterType}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterType: event.currentTarget.value,
                    page: 1,
                  })
                }
                data={[{ label: "Vše", value: "" }, ...tagTypes]}
              />
            </Table.Th>
            <Table.Th></Table.Th>
            <Table.Th>
              <Button
                size="xs"
                onClick={() =>
                  setState({
                    filterText: "",
                    filterType: "",
                    order: "text",
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
              <Table.Td colSpan={4}>
                <Alert color="red">{error}</Alert>
              </Table.Td>
            </Table.Tr>
          )}
          {loading && (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text ta="center">Načítání...</Text>
              </Table.Td>
            </Table.Tr>
          )}
          {data?.data.map((tag) => (
            <Table.Tr key={tag.id}>
              <Table.Td>{tag.text}</Table.Td>
              <Table.Td>{getTagLabel(String(tag.type))}</Table.Td>
              <Table.Td>
                <Badge c={tag.color} bg={tag.background}>
                  {tag.text}
                </Badge>
              </Table.Td>
              <Table.Td>
                <ActionIcon
                  variant="light"
                  component={Link}
                  href={`/dashboard/tags/${tag.id}`}
                >
                  <IconInfoSmall />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => {
                    setDeleteId(tag.id);
                    open();
                  }}
                >
                  <IconTrash />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  component={Link}
                  href={`/dashboard/tags/${tag.id}/edit`}
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
        title="Odstranění značky"
        centered
      >
        <Text>Opravdu chcete tuto značku odstranit?</Text>
        <Group mt="md">
          <Button
            color="red"
            onClick={() => {
              if (deleteId) {
                fetch(`/api/tags/${deleteId}`, { method: "DELETE" })
                  .then(() => {
                    notifications.show({
                      title: "Úspěch",
                      message: "Značka byla odstraněna.",
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

export default TagsTable;