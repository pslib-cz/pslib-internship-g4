"use client";

import React, { FC, useEffect, useState, useCallback, useContext } from "react";
import { AccountDrawerContext } from "@/providers/AccountDrawerProvider";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Table,
  Button,
  ActionIcon,
  Text,
  TextInput,
  Alert,
  Pagination,
  Flex,
  Group,
  Tooltip,
} from "@mantine/core";
import {
  IconInfoSmall,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { InternshipWithCompanyLocationSetUser } from "@/types/entities";
import { type ListResult } from "@/types/data";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { getInternshipKindLabel, getInternshipStateLabel } from "@/data/lists";

type TInternshipsTableProps = {};
type TInternshipsTableState = {
  filterUser: string;
  filterUserGivenName: string;
  filterUserSurname: string;
  filterSet: number | undefined;
  filterYear: number | undefined;
  filterCompany: number | undefined;
  filterCompanyName: string | undefined;
  filterClassname: string | undefined;
  filterState: number | undefined;
  order: string;
  page: number;
  size: number;
};

const STORAGE_ID = "users-internships-table";

const InternshipsTable: FC = (TInternshipsTableProps) => {
  const { pageSize: generalPageSize } = useContext(AccountDrawerContext);
  const searchParams = useSearchParams();
  const [loadTableState, storeTableState, removeTableState] =
    useSessionStorage<TInternshipsTableState>(STORAGE_ID);
  const [data, setData] =
    useState<ListResult<InternshipWithCompanyLocationSetUser> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<TInternshipsTableState>({
    filterUser: searchParams.get("user") ?? "",
    filterUserGivenName: searchParams.get("givenName") ?? "",
    filterUserSurname: searchParams.get("surname") ?? "",
    filterSet: searchParams.get("set")
      ? parseInt(searchParams.get("set") as string)
      : undefined,
    filterYear: searchParams.get("year")
      ? parseInt(searchParams.get("year") as string)
      : undefined,
    filterCompany: searchParams.get("company")
      ? parseInt(searchParams.get("company") as string)
      : undefined,
    filterState: searchParams.get("state")
      ? parseInt(searchParams.get("state") as string)
      : undefined,
    filterCompanyName: searchParams.get("companyName") ?? "",
    filterClassname: searchParams.get("classname") ?? "",
    order: searchParams.get("orderBy") ?? "created",
    page: searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1,
    size: searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : generalPageSize,
  });
  const isMobile = useMediaQuery("(max-width: 50em)");

  const fetchData = useCallback(
    (
      user: string,
      givenName: string,
      surname: string,
      set: number | undefined,
      year: number | undefined,
      company: number | undefined,
      companyName: string | undefined,
      classname: string | undefined,
      state: number | undefined,
      orderBy: string,
      page: number = 1,
      pageSize: number = 10,
    ) => {
      fetch(
        `/api/internships?user=${user}&givenName=${givenName}&surname=${surname}&set=${set !== undefined ? set : ""}&year=${year !== undefined ? year : ""}&company=${company !== undefined ? company : ""}&state=${state !== undefined ? state : ""}&companyName=${companyName}&class=${classname}&orderBy=${orderBy}&page=${page - 1}&size=${pageSize}`,
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
    const searchedUser = searchParams.get("user") ?? "";
    const searchedGivenName = searchParams.get("givenName") ?? "";
    const searchedSurname = searchParams.get("surname") ?? "";
    const searchedSet = searchParams.get("set")
      ? parseInt(searchParams.get("set") as string)
      : undefined;
    const searchedYear = searchParams.get("year")
      ? parseInt(searchParams.get("year") as string)
      : undefined;
    const searchedCompany = searchParams.get("company")
      ? parseInt(searchParams.get("company") as string)
      : undefined;
    const searchedState = searchParams.get("state")
      ? parseInt(searchParams.get("state") as string)
      : undefined;
    const searchedCompanyName = searchParams.get("companyName") ?? "";
    const searchedClassname = searchParams.get("classname") ?? "";
    const orderBy = searchParams.get("orderBy") ?? "created";
    const paginationPage = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const paginationSize = searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : generalPageSize;
    let URLState: TInternshipsTableState = {
      filterUser: searchedUser,
      filterUserGivenName: searchedGivenName,
      filterUserSurname: searchedSurname,
      filterSet: searchedSet,
      filterYear: searchedYear,
      filterCompany: searchedCompany,
      filterCompanyName: searchedCompanyName,
      filterClassname: searchedClassname,
      filterState: searchedState,
      order: orderBy,
      page: paginationPage,
      size: paginationSize,
    };
    setState({ ...URLState });
  }, [searchParams, loadTableState, generalPageSize]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    state.filterUser !== undefined && params.set("user", state.filterUser);
    state.filterUserGivenName !== undefined &&
      params.set("givenName", state.filterUserGivenName);
    state.filterUserSurname !== undefined &&
      params.set("surname", state.filterUserSurname);
    state.filterSet !== undefined && params.set("set", String(state.filterSet));
    state.filterYear !== undefined &&
      params.set("year", String(state.filterYear));
    state.filterCompany !== undefined &&
      params.set("company", String(state.filterCompany));
    state.filterCompanyName !== undefined &&
      params.set("companyName", state.filterCompanyName);
    state.filterClassname !== undefined &&
      params.set("classname", state.filterClassname);
    state.filterState !== undefined &&
      params.set("state", String(state.filterState));
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    params.set("orderBy", state.order);
    window.history.replaceState(null, "", `?${params.toString()}`);
    storeTableState(state);
    fetchData(
      state.filterUser,
      state.filterUserGivenName,
      state.filterUserSurname,
      state.filterSet,
      state.filterYear,
      state.filterCompany,
      state.filterCompanyName,
      state.filterClassname,
      state.filterState,
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
                    state.order === "givenName"
                      ? "givenName_desc"
                      : "givenName";
                  setState({ ...state, order: newOrder });
                }}
                style={{ cursor: "pointer" }}
              >
                Jméno{" "}
                {state.order === "givenName" ? (
                  <IconChevronDown size={12} />
                ) : state.order === "givenName_desc" ? (
                  <IconChevronUp size={12} />
                ) : null}
              </Text>
            </Table.Th>
            <Table.Th>
              <Text
                fw={700}
                onClick={() => {
                  let newOrder =
                    state.order === "surname" ? "surname_desc" : "surname";
                  setState({ ...state, order: newOrder });
                }}
                style={{ cursor: "pointer" }}
              >
                Příjmení{" "}
                {state.order === "surname" ? (
                  <IconChevronDown size={12} />
                ) : state.order === "surname_desc" ? (
                  <IconChevronUp size={12} />
                ) : null}
              </Text>
            </Table.Th>
            <Table.Th>
              <Text fw={700}>Sada</Text>
            </Table.Th>
            <Table.Th>
              <Text fw={700}>Rok</Text>
            </Table.Th>
            <Table.Th>
              <Text fw={700}>Třída</Text>
            </Table.Th>
            <Table.Th>
              <Text fw={700}>Firma</Text>
            </Table.Th>
            <Table.Th>
              <Text fw={700}>Způsob</Text>
            </Table.Th>
            <Table.Th>
              <Text fw={700}>Stav</Text>
            </Table.Th>
            <Table.Th>
              <Text
                fw={700}
                onClick={() => {
                  let newOrder =
                    state.order === "created" ? "created_desc" : "created";
                  setState({ ...state, order: newOrder });
                }}
                style={{ cursor: "pointer" }}
              >
                Vytvořeno{" "}
                {state.order === "created" ? (
                  <IconChevronDown size={12} />
                ) : state.order === "created_desc" ? (
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
                value={state.filterUserGivenName}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterUserGivenName: event.currentTarget.value,
                    page: 1,
                  });
                }}
              />
            </Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterUserSurname}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterUserSurname: event.currentTarget.value,
                    page: 1,
                  });
                }}
              />
            </Table.Th>
            <Table.Th></Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterYear}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterYear: event.currentTarget.value
                      ? parseInt(event.currentTarget.value)
                      : undefined,
                    page: 1,
                  });
                }}
              />
            </Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterClassname}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterClassname: event.currentTarget.value
                      ? event.currentTarget.value
                      : undefined,
                    page: 1,
                  });
                }}
              />
            </Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterCompanyName}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterCompanyName: event.currentTarget.value
                      ? event.currentTarget.value
                      : undefined,
                    page: 1,
                  });
                }}
              />
            </Table.Th>
            <Table.Th></Table.Th>
            <Table.Th></Table.Th>
            <Table.Th></Table.Th>
            <Table.Th>
              <Button
                size="xs"
                onClick={(event) => {
                  setState({
                    ...state,
                    filterUser: "",
                    filterUserGivenName: "",
                    filterUserSurname: "",
                    filterSet: undefined,
                    filterYear: undefined,
                    filterCompany: undefined,
                    filterCompanyName: "",
                    filterClassname: "",
                    filterState: undefined,
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
                Žádná praxe nevyhovuje podmínkám.
              </Table.Td>
            </Table.Tr>
          )}
          {data &&
            data.data.map((internship) => (
              <Table.Tr key={internship.id}>
                <Table.Td>
                  <Text>{internship.user.givenName}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{internship.user.surname}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{internship.set.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{internship.set.year}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{internship.classname}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{internship.company.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{getInternshipKindLabel(String(internship.kind))}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>
                    {getInternshipStateLabel(String(internship.state))}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text>{new Date(internship.created).toLocaleString()}</Text>
                </Table.Td>
                <Table.Td>
                  <Group>
                    <Tooltip label="Podrobnosti">
                      <ActionIcon
                        variant="light"
                        component={Link}
                        href={"/internships/" + internship.id}
                      >
                        <IconInfoSmall />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
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
    </>
  );
};

export default InternshipsTable;
