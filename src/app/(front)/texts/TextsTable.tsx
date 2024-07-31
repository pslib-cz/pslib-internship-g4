"use client";

import React, { FC, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Table,
  Button,
  Text,
  TextInput,
  Alert,
  Pagination,
  Flex,
  Anchor,
} from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { TextWithAuthor } from "@/types/entities";
import { type ListResult } from "@/types/data";
import { useSessionStorage } from "@/hooks/useSessionStorage";

type TTextsTableProps = {};
type TTextsTableState = {
  filterTitle: string;
  filterAuthor: string;
  order: string;
  page: number;
  size: number;
};

const STORAGE_ID = "user-texts-table";

const TextsTable: FC = (TTextsTableProps) => {
  const searchParams = useSearchParams();
  const [loadTableState, storeTableState, removeTableState] =
    useSessionStorage<TTextsTableState>(STORAGE_ID);
  const [data, setData] = useState<ListResult<TextWithAuthor> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<TTextsTableState>({
    filterTitle: "",
    filterAuthor: "",
    order: "title",
    page: 1,
    size: 10,
  });
  const isMobile = useMediaQuery("(max-width: 50em)");

  const fetchData = useCallback(
    (
      title: string | undefined,
      author: string | undefined,
      orderBy: string,
      page: number = 1,
      pageSize: number = 10,
    ) => {
      fetch(
        `/api/texts?title=${title}&published=${1}&author=${author ?? ""}&orderBy=${orderBy}&page=${page - 1}&size=${pageSize}`,
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
    const searchedAuthor = searchParams.get("author") ?? "";
    const orderBy = searchParams.get("orderBy") ?? "title";
    const paginationPage = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const paginationSize = searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10;
    let URLState: TTextsTableState = {
      filterTitle: searchedTitle,
      filterAuthor: searchedAuthor,
      order: orderBy,
      page: paginationPage,
      size: paginationSize,
    };
    setState({ ...URLState });
  }, [searchParams, loadTableState]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    state.filterTitle !== undefined && params.set("title", state.filterTitle);
    state.filterAuthor !== null && params.set("author", state.filterAuthor);
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    params.set("orderBy", state.order);
    window.history.replaceState(null, "", `?${params.toString()}`);
    storeTableState(state);
    fetchData(
      state.filterTitle,
      state.filterAuthor,
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
              <Text fw={700}>Autor </Text>
            </Table.Th>
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
            <Table.Th></Table.Th>
            <Table.Th>
              <Button
                size="xs"
                onClick={(event) => {
                  setState({
                    ...state,
                    filterTitle: "",
                    filterAuthor: "",
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
                  <Text>
                    <Anchor component={Link} href={"/texts/" + txt.id}>
                      {txt.title}
                    </Anchor>
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text>
                    {txt.creator.givenName} {txt.creator.surname}
                  </Text>
                </Table.Td>
                <Table.Td></Table.Td>
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
    </>
  );
};

export default TextsTable;
