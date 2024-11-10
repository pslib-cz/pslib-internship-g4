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
  IconCheck,
  IconX,
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
  filterCountry: string;
  order: string;
  page: number;
  size: number;
};

const STORAGE_ID = "companies-table";

const CompaniesTable: FC = (TCompaniesTableProps) => {
  const searchParams = useSearchParams();
  const { pageSize: generalPageSize } = useContext(AccountDrawerContext);
  const [loadTableState, storeTableState, removeTableState] =
    useSessionStorage<TCompaniesTableState>(STORAGE_ID);
  const [data, setData] = useState<ListResult<CompanyWithLocation> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<TCompaniesTableState>({
    filterMunicipality: searchParams.get("municipality") ?? "",
    filterTax: searchParams.get("tax") ?? "",
    filterName: searchParams.get("name") ?? "",
    filterActive:
      searchParams.has("active") && searchParams.get("active") !== ""
        ? searchParams.get("active") === "true"
          ? true
          : false
        : undefined,
    filterCountry: searchParams.get("country") ?? "",
    order: searchParams.get("orderBy") ?? "name",
    page: searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1,
    size: searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : generalPageSize,
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
      country: string | undefined,
      orderBy: string,
      page: number = 1,
      pageSize: number = 10,
    ) => {
      fetch(
        `/api/companies?name=${name}&taxNum=${tax}&active=${active === undefined ? "" : active}&municipality=${municipality}&country=${country}&orderBy=${orderBy}&page=${page - 1}&size=${pageSize}`,
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
    //let storedState = loadTableState();
    const searchedName = searchParams.get("name") ?? "";
    const searchedTax = searchParams.get("tax") ?? "";
    const searchedActive =
      searchParams.has("active") && searchParams.get("active") !== ""
        ? searchParams.get("active") === "true"
          ? true
          : false
        : undefined;
    const searchedMunicipality = searchParams.get("municipality") ?? "";
    const searchedCountry = searchParams.get("country") ?? "";
    const orderBy = searchParams.get("orderBy") ?? "name";
    const paginationPage = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const paginationSize = searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : generalPageSize;
    let URLState: TCompaniesTableState = {
      filterName: searchedName,
      filterTax: searchedTax,
      filterMunicipality: searchedMunicipality,
      filterActive: searchedActive,
      filterCountry: searchedCountry,
      order: orderBy,
      page: paginationPage,
      size: paginationSize,
    };
    setState({ ...URLState });
  }, [searchParams /*loadTableState*/, generalPageSize]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    state.filterName !== undefined && params.set("name", state.filterName);
    state.filterMunicipality !== undefined &&
      params.set("municipality", state.filterMunicipality);
    state.filterActive === undefined
      ? params.set("active", "")
      : params.set("active", state.filterActive === true ? "true" : "false");
    state.filterTax !== undefined && params.set("tax", state.filterTax);
    state.filterCountry !== undefined &&
      params.set("country", state.filterCountry);
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
      state.filterCountry,
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
              <Text fw={700}>IČO</Text>
            </Table.Th>
            <Table.Th>
              <Text fw={700}>Aktivní</Text>
            </Table.Th>
            <Table.Th>
              <Text
                fw={700}
                onClick={() => {
                  let newOrder =
                    state.order === "municipality"
                      ? "municipality_desc"
                      : "municipality";
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
                  let newOrder =
                    state.order === "country" ? "country_desc" : "country";
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
              <NativeSelect
                size="xs"
                value={
                  state.filterActive === undefined
                    ? ""
                    : state.filterActive === true
                      ? "true"
                      : "false"
                }
                onChange={(event) =>
                  setState({
                    ...state,
                    filterActive:
                      event.currentTarget.value === ""
                        ? undefined
                        : event.currentTarget.value === "true"
                          ? true
                          : false,
                    page: 1,
                  })
                }
                data={[
                  { label: "Vše", value: "" },
                  { label: "Aktivní", value: "true" },
                  { label: "Zrušená", value: "false" },
                ]}
              />
            </Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterMunicipality}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterMunicipality: event.currentTarget.value,
                    page: 1,
                  });
                }}
              />
            </Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterCountry}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterCountry: event.currentTarget.value,
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
                  <Text>
                    {company.companyIdentificationNumber
                      ? String(company.companyIdentificationNumber).padStart(
                          8,
                          "0",
                        )
                      : ""}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text>{company.active ? <IconCheck /> : <IconX />}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{company.location.municipality}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{company.location.country}</Text>
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
                      state.filterName,
                      state.filterTax,
                      state.filterActive,
                      state.filterMunicipality,
                      state.filterCountry,
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
