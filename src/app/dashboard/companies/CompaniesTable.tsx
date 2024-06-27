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
import { CompanyWithLocation } from "@/types/entities";
import { type ListResult } from "@/types/data";
import { useSessionStorage } from "@/hooks/useSessionStorage";

type TCompaniesTableProps = {};
type TCompaniesTableState = {
  filterName: string;
  filterTax: string;
  filterActive: boolean | undefined;
  filterMunicipality: string;
  order: string;
  page: number;
  size: number;
};

const STORAGE_ID ="companies-table";

const CompaniesTable: FC = (TCompaniesTableProps) => {
  const searchParams = useSearchParams();
  const [loadTableState, storeTableState, removeTableState] =
    useSessionStorage<TCompaniesTableState>(STORAGE_ID);
  const [data, setData] = useState<ListResult<CompanyWithLocation> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<TCompaniesTableState>({
    filterMunicipality: "",
    filterTax: "",
    filterName: "",
    filterActive: undefined,
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
      tax: string | undefined,
      active: boolean | undefined,
      municipality: string | undefined,
      orderBy: string,
      page: number = 1,
      pageSize: number = 10,
    ) => {
      fetch(
        `/api/companies?name=${name}&taxNum=${tax}&active=${active}&municipality=${municipality}&orderBy=${orderBy}&page=${page - 1}&size=${pageSize}`,
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
    const searchedTax = searchParams.get("tax") ?? "";
    const searchedActive = searchParams.get("active") ?? "";
    const searchedMunicipality = searchParams.get("municipality") ?? "";
    const orderBy = searchParams.get("orderBy") ?? "municipality";
    const paginationPage = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const paginationSize = searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10;
    let URLState: TCompaniesTableState = {
      filterName: searchedName,
      filterTax: searchedTax,
      filterMunicipality: searchedMunicipality,
      filterActive: searchedActive === "true" ? true : searchedActive === "false" ? false : undefined,
      order: orderBy,
      page: paginationPage,
      size: paginationSize,
    };
    setState({ ...URLState });
  }, [searchParams, loadTableState]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    state.filterName !== undefined && params.set("name", state.filterName);
    state.filterMunicipality !== undefined && params.set("municipality", state.filterMunicipality);
    state.filterActive !== undefined && params.set("active", state.filterActive ? "true" : "false");
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    params.set("orderBy", state.order);
    window.history.replaceState(null, "", `?${params.toString()}`);
    storeTableState(state);
    fetchData(
      state.filterName,
      state.filterTax,
      state.filterActive,
      state.filterMunicipality,
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
            <Table.Th>
              <Text fw={700}>Č.p.</Text>
            </Table.Th>
            <Table.Th>
            <Text
                fw={700}
                onClick={() => {
                  let newOrder = state.order === "municipality" ? "municipality_desc" : "municipality";
                  setState({ ...state, order: newOrder });
                }}
                style={{ cursor: "pointer" }}
              >
                Obec{" "}
                {state.order === "municipality" ? (
                  <IconChevronDown size={12} />
                ) : state.order === "municipality_desc" ? (
                  <IconChevronUp size={12} />
                ) : null}
              </Text>
              </Table.Th>
              <Table.Th>
              <Text
                fw={700}
                onClick={() => {
                  let newOrder = state.order === "country" ? "country_desc" : "country";
                  setState({ ...state, order: newOrder });
                }}
                style={{ cursor: "pointer" }}
              >
                Stát{" "}
                {state.order === "country" ? (
                  <IconChevronDown size={12} />
                ) : state.order === "country_desc" ? (
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
            <Table.Th></Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterTax}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterTax: event.currentTarget.value,
                    page: 1,
                  });
                }}
              />
            </Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterActive}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterActive: event.currentTarget.value,
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
                    filterTax: "",
                    filterActive: undefined,
                    filterMunicipality: "",
                    order: "text",
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
                Žádná firma nevyhovuje podmínkám.
              </Table.Td>
            </Table.Tr>
          )}
          {data &&
            data.data.map((company) => (
              <Table.Tr key={company.id}>
                <Table.Td>
                  <Text>{company.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{company.descNo}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{company.municipality}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{company.country}</Text>
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={"/dashboard/companies/" + company.id}
                  >
                    <IconInfoSmall />
                  </ActionIcon>{" "}
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => {
                      setDeleteId(company.id);
                      open();
                    }}
                  >
                    <IconTrash />
                  </ActionIcon>{" "}
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={"/dashboard/companies/" + company.id + "/edit"}
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
        title="Odstranění firmy"
        fullScreen={isMobile}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <Text>Opravdu si přejete tuto firmu odstranit?</Text>
        <Text fw={700}>Data pak už nebude možné obnovit.</Text>
        <Group mt="xl">
          <Button
            onClick={() => {
              if (deleteId !== null) {
                fetch("/api/companies/" + deleteId, {
                  method: "DELETE",
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                    notifications.show({
                      title: "Povedlo se!",
                      message: "Firma byla odstraněna.",
                      color: "lime",
                    });
                    fetchData(
                      state.filterCountry,
                      state.filterMunicipality,
                      state.filterStreet,
                      state.order,
                      state.page,
                      state.size,
                    );
                  })
                  .catch((error) => {
                    notifications.show({
                      title: "Chyba!",
                      message: "Smazání firmy nebylo úspěšné.",
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

export default CompaniesTable;
