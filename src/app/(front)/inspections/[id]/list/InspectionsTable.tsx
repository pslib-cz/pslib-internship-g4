"use client";

import React, { FC, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {Inspection} from "@prisma/client";
import {
  Table,
  Button,
  Text,
  Alert,
  Pagination,
  Flex,
  Box,
  Group,
  ActionIcon,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { type ListResult } from "@/types/data";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { DateTime } from "@/components";
import { useSession } from "next-auth/react";
import { getInspectionResultLabel, getInternshipKindLabel } from "@/data/lists";
import { InspectionWithInspectorAndInternship } from "@/types/entities";

type TInspectionsTableProps = {
    internshipId: string;
};
type TInspectionsTableState = {
  order: string;
  page: number;
  size: number;
};

const STORAGE_ID = "inspect-list-table";

const InspectionsTable: FC<TInspectionsTableProps> = ({internshipId}) => {
  const searchParams = useSearchParams();
  const [loadTableState, storeTableState, removeTableState] =
    useSessionStorage<TInspectionsTableState>(STORAGE_ID);
  const [data, setData] = useState<ListResult<InspectionWithInspectorAndInternship> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<TInspectionsTableState>({
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
        `/api/inspections?internship=${internshipId}&orderBy=${orderBy}&page=${page - 1}&size=${pageSize}`,
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

  const deleteInspection = useCallback((id: number) => {
    fetch(`/api/inspections/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Došlo k chybě při mazání kontroly.");
        }
        notifications.show({
          title: "Úspěch",
          message: "Kontrola byla úspěšně smazána.",
          color: "green",
        });
        fetchData(
          state.order,
          state.page,
          state.size,
        );
      })
      .catch((error) => {
        notifications.show({
          title: "Chyba!",
          message: "Došlo k chybě při mazání kontroly.",
          color: "red",
        });
      });
  },[state, fetchData]);

  useEffect(() => {
    let storedState = loadTableState();
    const orderBy = searchParams.get("orderBy") ?? "date";
    const paginationPage = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const paginationSize = searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10;
    let URLState: TInspectionsTableState = {
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
                <Text fw={700}>Kontroloval</Text>
              </Table.Th>
              <Table.Th>
                <Text fw={700}>Výsledek</Text>
              </Table.Th>
              <Table.Th>
                <Text fw={700}>Způsob</Text>
              </Table.Th>
              <Table.Th>
                <Text fw={700}>Poznámka</Text>
              </Table.Th>
              <Table.Th>
                <Button
                  size="xs"
                  onClick={(event) => {
                    setState({
                      ...state,
                      order: "created",
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
              data.data?.map((inspection) => (
                <Table.Tr key={inspection.id}>
                  <Table.Td>
                    <DateTime date={inspection.date} locale="cs" />
                  </Table.Td>
                  <Table.Td>
                    {inspection.inspectionUser.givenName} {inspection.inspectionUser.surname}
                  </Table.Td>
                  <Table.Td>
                    {getInspectionResultLabel(String(inspection.result))}
                  </Table.Td>
                  <Table.Td>
                    {getInternshipKindLabel(String(inspection.kind))}
                  </Table.Td>
                  <Table.Td>
                  <Box
            dangerouslySetInnerHTML={{ __html: inspection.note ?? "" }}
          />
                  </Table.Td>
                  <Table.Td>
                    <Group>
                      {session?.user?.id === inspection.inspectionUser.id &&(
                        <ActionIcon color="red" onClick={e=>{
                          deleteInspection(inspection.id);
                        }}>
                        <IconTrash />
                      </ActionIcon>
                      )}
                      
                    </Group>
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

export default InspectionsTable;
