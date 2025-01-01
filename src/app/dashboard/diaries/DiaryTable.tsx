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
  IconTrash,
  IconEdit,
  IconInfoSmall,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { type ListResult } from "@/types/data";

type TDiaryTableProps = {};
type TDiaryTableState = {
  filterAuthorGivenName: string;
  filterAuthorSurname: string;
  filterInternshipId: string;
  order: string;
  page: number;
  size: number;
};

const DiaryTable: FC<TDiaryTableProps> = () => {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ListResult<any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteOpened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const initialState: TDiaryTableState = {
    filterAuthorGivenName: searchParams.get("authorGivenName") ?? "",
    filterAuthorSurname: searchParams.get("authorSurname") ?? "",
    filterInternshipId: searchParams.get("internship") ?? "",
    order: searchParams.get("orderBy") ?? "date",
    page: parseInt(searchParams.get("page") ?? "1"),
    size: parseInt(searchParams.get("size") ?? "10"),
  };

  const [state, setState] = useState<TDiaryTableState>(initialState);

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (state.filterAuthorGivenName) params.set("authorGivenName", state.filterAuthorGivenName);
    if (state.filterAuthorSurname) params.set("authorSurname", state.filterAuthorSurname);
    if (state.filterInternshipId) params.set("internship", state.filterInternshipId);
    params.set("orderBy", state.order);
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [state]);

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      authorGivenName: state.filterAuthorGivenName,
      authorSurname: state.filterAuthorSurname,
      internship: state.filterInternshipId,
      orderBy: state.order,
      page: (state.page - 1).toString(),
      size: state.size.toString(),
    });

    fetch(`/api/diaries?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Chyba při načítání dat.");
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
  }, [state, fetchData, updateURL]);

  const handleInternshipClick = (internshipId: string) => {
    setState({
      ...state,
      filterInternshipId: internshipId,
      page: 1,
    });
  };

  const truncateText = (text: string, length: number = 100) => {
    if (text.length <= length) return text;
    return `${text.substring(0, length)}...`;
  };

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Text
                fw={700}
                onClick={() => {
                  const newOrder = state.order === "date" ? "date_desc" : "date";
                  setState({ ...state, order: newOrder, page: 1 });
                }}
                style={{ cursor: "pointer" }}
              >
                Datum{" "}
                {state.order === "date" ? (
                  <IconChevronDown size={12} />
                ) : state.order === "date_desc" ? (
                  <IconChevronUp size={12} />
                ) : null}
              </Text>
            </Table.Th>
            <Table.Th>ID praxe</Table.Th>
            <Table.Th>Jméno autora</Table.Th>
            <Table.Th>Příjmení autora</Table.Th>
            <Table.Th>Záznam</Table.Th>
            <Table.Th>Možnosti</Table.Th>
          </Table.Tr>
          <Table.Tr>
            <Table.Th></Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                placeholder="ID praxe"
                value={state.filterInternshipId}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterInternshipId: event.currentTarget.value,
                    page: 1,
                  })
                }
              />
            </Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                placeholder="Jméno autora"
                value={state.filterAuthorGivenName}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterAuthorGivenName: event.currentTarget.value,
                    page: 1,
                  })
                }
              />
            </Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                placeholder="Příjmení autora"
                value={state.filterAuthorSurname}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterAuthorSurname: event.currentTarget.value,
                    page: 1,
                  })
                }
              />
            </Table.Th>
            <Table.Th></Table.Th>
            <Table.Th>
              <Button
                size="xs"
                onClick={() =>
                  setState({
                    filterAuthorGivenName: "",
                    filterAuthorSurname: "",
                    filterInternshipId: "",
                    order: "date",
                    page: 1,
                    size: 10,
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
              <Table.Td colSpan={6}>Načítám data...</Table.Td>
            </Table.Tr>
          )}
          {error && (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Alert color="red">{error}</Alert>
              </Table.Td>
            </Table.Tr>
          )}
          {data?.data.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={6}>Žádné záznamy k zobrazení.</Table.Td>
            </Table.Tr>
          )}
          {data?.data.map((diary) => (
            <Table.Tr key={diary.id}>
              <Table.Td>{new Date(diary.date).toLocaleDateString()}</Table.Td>
              <Table.Td>
                <Text
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => handleInternshipClick(diary.internshipId)}
                >
                  {diary.internshipId}
                </Text>
              </Table.Td>
              <Table.Td>{diary.createdBy.givenName}</Table.Td>
              <Table.Td>{diary.createdBy.surname}</Table.Td>
              <Table.Td>
                <Text>
                  {truncateText(diary.text)}{" "}
                  {diary.text.length > 100 && (
                    <Link href={`/dashboard/diaries/${diary.id}`}>
                      <Button size="xs" variant="subtle">
                        Více
                      </Button>
                    </Link>
                  )}
                </Text>
              </Table.Td>
              <Table.Td>
                <ActionIcon
                  variant="light"
                  component={Link}
                  href={`/dashboard/diaries/${diary.id}`}
                >
                  <IconInfoSmall />
                </ActionIcon>{" "}
                <ActionIcon
                  variant="light"
                  component={Link}
                  href={`/dashboard/diaries/${diary.id}/edit`}
                >
                  <IconEdit />
                </ActionIcon>{" "}
                <ActionIcon
                  color="red"
                  onClick={() => {
                    setDeleteId(diary.id);
                    open();
                  }}
                >
                  <IconTrash />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Flex justify="center">
        <Pagination
          total={Math.ceil((data?.total ?? 0) / (data?.size ?? 10))}
          value={state.page}
          onChange={(page) => setState({ ...state, page })}
        />
      </Flex>
      <Modal
        opened={deleteOpened}
        onClose={close}
        title="Smazání záznamu"
        centered
        size="sm"
      >
        <Text>Opravdu chcete tento záznam smazat?</Text>
        <Group mt="md">
          <Button
            color="red"
            onClick={() => {
              if (deleteId) {
                fetch(`/api/diaries/${deleteId}`, { method: "DELETE" })
                  .then((res) => {
                    if (!res.ok) {
                      throw new Error("Smazání selhalo");
                    }
                    notifications.show({
                      title: "Smazáno",
                      message: "Záznam byl úspěšně smazán",
                      color: "green",
                    });
                    fetchData();
                  })
                  .catch(() =>
                    notifications.show({
                      title: "Chyba",
                      message: "Smazání se nezdařilo",
                      color: "red",
                    })
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
          <Button variant="default" onClick={close}>
            Zrušit
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default DiaryTable;
