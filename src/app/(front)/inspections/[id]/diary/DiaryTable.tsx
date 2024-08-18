"use client";

import React, { FC, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {Diary} from "@prisma/client";
import {
  Table,
  Button,
  Text,
  Alert,
  Pagination,
  Flex,
  Box
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { type ListResult } from "@/types/data";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { DateTime } from "@/components";
import { useSession } from "next-auth/react";

type TDiaryTableProps = {
    internshipId: string;
};
type TDiaryTableState = {
  order: string;
  page: number;
  size: number;
};

const STORAGE_ID = "inspect-diary-table";

const DiaryTable: FC<TDiaryTableProps> = ({internshipId}) => {
  const searchParams = useSearchParams();
  const [loadTableState, storeTableState, removeTableState] =
    useSessionStorage<TDiaryTableState>(STORAGE_ID);
  const [data, setData] = useState<ListResult<Diary> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<TDiaryTableState>({
    order: searchParams.get("orderBy") ?? "created",
    page: searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1,
    size: searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10,
  });
  const { data: session, status } = useSession();
  const isMobile = useMediaQuery("(max-width: 50em)");
  const isTablet = useMediaQuery("(max-width: 992px)");

  const fetchData = useCallback(
    (
      orderBy: string,
      page: number = 1,
      pageSize: number = 10,
    ) => {
      setError(null);
      fetch(
        `/api/internships/${internshipId}/diary?orderBy=${orderBy}&page=${page - 1}&size=${pageSize}`,
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
    [internshipId],
  );

  useEffect(() => {
    let storedState = loadTableState();
    const orderBy = searchParams.get("orderBy") ?? "date";
    const paginationPage = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const paginationSize = searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10;
    let URLState: TDiaryTableState = {
      order: orderBy,
      page: paginationPage,
      size: paginationSize,
    };
    setState({ ...URLState });
  }, [searchParams, loadTableState]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    params.set("orderBy", state.order);
    window.history.replaceState(null, "", `?${params.toString()}`);
    storeTableState(state);
    fetchData(
      state.order,
      state.page,
      state.size,
    );
  }, [state, fetchData, searchParams, storeTableState]);

  return (
    <>
      <Table.ScrollContainer minWidth={1300}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Text
                  fw={700}
                  onClick={() => {
                    let newOrder =
                      state.order === "" ? "date_desc" : "date";
                    setState({ ...state, order: newOrder });
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
              <Table.Th>
                <Text fw={700}>Text</Text>
              </Table.Th>
              <Table.Th>
                <Text fw={700}>Vytvořeno</Text>
              </Table.Th>
              <Table.Th>
                <Button
                  size="xs"
                  onClick={(event) => {
                    setState({
                      ...state,
                      order: "date",
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
                  Žádný záznam neodpovídá požadavkům.
                </Table.Td>
              </Table.Tr>
            )}
            {data &&
              data.data?.map((diary) => (
                <Table.Tr key={diary.id}>
                  <Table.Td>
                    <DateTime date={diary.date} locale="cs" />
                  </Table.Td>
                  <Table.Td>
                  <Box
            dangerouslySetInnerHTML={{ __html: diary.text ?? "" }}
          />
                  </Table.Td>
                  <Table.Td>
                  <DateTime date={diary.created} locale="cs" />
                  </Table.Td>
                  <Table.Td>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
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

export default DiaryTable;
