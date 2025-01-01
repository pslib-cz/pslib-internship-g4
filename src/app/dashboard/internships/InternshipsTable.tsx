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
  Select,
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
import { InternshipWithCompanyLocationSetUser } from "@/types/entities";
import { type ListResult } from "@/types/data";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import {
  getInternshipKindLabel,
  getInternshipStateLabel,
  internshipKinds,
  internshipStates,
} from "@/data/lists";

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
  filterKind: number | undefined;
  order: string;
  page: number;
  size: number;
};

const STORAGE_ID = "internships-table";

const InternshipsTable: FC = (TInternshipsTableProps) => {
  const searchParams = useSearchParams();
  const [loadTableState, storeTableState, removeTableState] =
    useSessionStorage<TInternshipsTableState>(STORAGE_ID);
  const [data, setData] =
    useState<ListResult<InternshipWithCompanyLocationSetUser> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
    filterKind: searchParams.get("kind") ? parseInt(searchParams.get("kind") as string) : undefined,
    order: searchParams.get("orderBy") ?? "created",
    page: searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1,
    size: searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10,
  });
  const [deleteOpened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
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
      kind: number | undefined,
      orderBy: string,
      page: number = 1,
      pageSize: number = 10,
    ) => {
      setLoading(true);
      fetch(
        `/api/internships?user=${user}&givenName=${givenName}&surname=${surname}&set=${set !== undefined ? set : ""}&year=${year !== undefined ? year : ""}&company=${company !== undefined ? company : ""}&state=${state !== undefined ? state : ""}&kind=${kind !== undefined ? kind : ""}&companyName=${companyName}&class=${classname}&orderBy=${orderBy}&page=${page - 1}&size=${pageSize}`,
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
        .finally(() => {
          setLoading(false);
        });
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
    const searchedKind = searchParams.get("kind")
      ? parseInt(searchParams.get("kind") as string)
      : undefined;
    const searchedCompanyName = searchParams.get("companyName") ?? "";
    const searchedClassname = searchParams.get("classname") ?? "";
    const orderBy = searchParams.get("orderBy") ?? "created";
    const paginationPage = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const paginationSize = searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10;
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
      filterKind: searchedKind,
      order: orderBy,
      page: paginationPage,
      size: paginationSize,
    };
    setState({ ...URLState });
  }, [searchParams, loadTableState]);

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
    state.filterState !== undefined ? params.set("state", String(state.filterState)) : params.delete("state");
    state.filterKind !== undefined ? params.set("kind", String(state.filterKind)) : params.delete("kind");
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
      state.filterKind,
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
                    state.order === "" ? "givenName_desc" : "givenName";
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
                    state.order === "" ? "surname_desc" : "surname";
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
            <Table.Th>
            <NativeSelect
              size="xs"
              data={[
                { value: "", label: "- Vše -" },
                ...internshipKinds.map((kind) => ({
                  value: kind.value.toString(),
                  label: kind.label,
                })),
              ]}
              value={state.filterKind?.toString() ?? ""}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setState({
                  ...state,
                  filterKind: value ? parseInt(value) : undefined,
                  page: 1,
                });
              }}
            />
            </Table.Th>
            <Table.Th>
            <NativeSelect
              size="xs"
              data={[
                { value: "", label: "- Vše -" },
                ...internshipStates.map((state) => ({
                  value: state.value.toString(),
                  label: state.label,
                })),
              ]}
              value={state.filterState?.toString() ?? ""}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setState({
                  ...state,
                  filterState: value ? parseInt(value) : undefined,
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
                    filterUser: "",
                    filterUserGivenName: "",
                    filterUserSurname: "",
                    filterSet: undefined,
                    filterYear: undefined,
                    filterCompany: undefined,
                    filterCompanyName: "",
                    filterClassname: "",
                    filterState: undefined,
                    filterKind: undefined,
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
          {loading && (
            <Table.Tr>
              <Table.Td colSpan={100}>
                Načítám data...
              </Table.Td>
            </Table.Tr>
          )}
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
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={"/dashboard/internships/" + internship.id}
                  >
                    <IconInfoSmall />
                  </ActionIcon>{" "}
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => {
                      setDeleteId(internship.id);
                      open();
                    }}
                  >
                    <IconTrash />
                  </ActionIcon>{" "}
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={"/dashboard/internships/" + internship.id + "/edit"}
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
        title="Odstranění praxe"
        fullScreen={isMobile}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <Text>Opravdu si přejete tuto praxi odstranit?</Text>
        <Text fw={700}>Data pak už nebude možné obnovit.</Text>
        <Group mt="xl">
          <Button
            onClick={() => {
              if (deleteId !== null) {
                fetch("/api/internships/" + deleteId, {
                  method: "DELETE",
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                    notifications.show({
                      title: "Povedlo se!",
                      message: "Praxe byla odstraněna.",
                      color: "lime",
                    });
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
                      state.filterKind,
                      state.order,
                      state.page,
                      state.size,
                    );
                  })
                  .catch((error) => {
                    notifications.show({
                      title: "Chyba!",
                      message: "Smazání praxe nebylo úspěšné.",
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

export default InternshipsTable;
