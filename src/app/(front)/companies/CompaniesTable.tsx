import { useSession } from "next-auth/react";
import {
  type FilterState,
  FilterContext,
} from "@/providers/CompanyFilterProvider";
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
  NativeSelect,
  Anchor,
  Tooltip,
  Group,
} from "@mantine/core";
import {
  IconInfoSmall,
  IconChevronDown,
  IconChevronUp,
  IconCheck,
  IconX,
  IconClockPlus,
} from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { CompanyWithLocation } from "@/types/entities";
import { type ListResult } from "@/types/data";
import { useSessionStorage } from "@/hooks/useSessionStorage";

type CompaniesTableProps = {};

const STORAGE_ID = "user-companies-table";

export const CompaniesTable: React.FC<CompaniesTableProps> = () => {
  const searchParams = useSearchParams();
  const { pageSize: generalPageSize } = useContext(AccountDrawerContext);
  const [state, dispatch] = useContext(FilterContext);
  const { data: session } = useSession();
  const [order, setOrder] = useState(searchParams.get("orderBy") ?? "name");
  const [page, setPage] = useState<number>(
    searchParams.get("page") ? parseInt(searchParams.get("page") as string) : 1,
  );
  const [size, setSize] = useState<number>(
    searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : generalPageSize,
  );
  const [data, setData] = useState<ListResult<CompanyWithLocation> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
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
      tags: number[] = [],
    ) => {
      const tagsParam = tags.length > 0 ? `&tag=${tags.join(",")}` : "";
      fetch(
        `/api/companies?name=${name}&taxNum=${tax !== undefined ? tax : ""}&active=${active !== undefined ? active : ""}&municipality=${municipality}${tagsParam}&orderBy=${orderBy}&page=${page - 1}&size=${pageSize}`,
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
    const orderBy = searchParams.get("orderBy") ?? "name";
    const paginationPage = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const paginationSize = searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : generalPageSize;
    setOrder(orderBy);
    setPage(paginationPage);
    setSize(paginationSize);
  }, [searchParams, generalPageSize]);

  useEffect(() => {
    setSize(generalPageSize);
  }, [generalPageSize]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    state.filterName !== undefined && params.set("name", state.filterName);
    state.filterMunicipality !== undefined &&
      params.set("municipality", state.filterMunicipality);
    state.filterActive === undefined
      ? params.set("active", "")
      : params.set("active", state.filterActive === true ? "true" : "false");
    state.filterTags.length > 0 ?
      params.set("tag", state.filterTags.join(","))
      : params.delete("tag");
    params.set("page", page.toString());
    params.set("size", size.toString());
    params.set("orderBy", order);
    window.history.replaceState(null, "", `?${params.toString()}`);
    fetchData(
      state.filterName,
      state.filterTaxNum ? state.filterTaxNum.toString() : undefined,
      state.filterActive,
      state.filterMunicipality,
      order,
      page,
      size,
      state.filterTags,
    );
  }, [state, order, page, size, fetchData, searchParams]);

  return (
    <>
      <Table.ScrollContainer minWidth={500}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Text
                  fw={700}
                  onClick={() => {
                    let newOrder = order === "name" ? "name_desc" : "name";
                    setOrder(newOrder);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Název{" "}
                  {order === "name" ? (
                    <IconChevronDown size={12} />
                  ) : order === "name_desc" ? (
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
                      order === "municipality"
                        ? "municipality_desc"
                        : "municipality";
                    setOrder(newOrder);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Obec{" "}
                  {order === "municipality" ? (
                    <IconChevronDown size={12} />
                  ) : order === "municipality_desc" ? (
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
                    dispatch({
                      type: "SET_NAME_FILTER",
                      text: event.currentTarget.value,
                    });
                  }}
                />
              </Table.Th>
              <Table.Th>
                <TextInput
                  size="xs"
                  value={state.filterTaxNum}
                  onChange={(event) => {
                    dispatch({
                      type: "SET_TAX_FILTER",
                      number:
                        event.currentTarget.value === ""
                          ? undefined
                          : Number(event.currentTarget.value),
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
                    dispatch({
                      type: "SET_ACTIVE_FILTER",
                      activity:
                        event.currentTarget.value === ""
                          ? undefined
                          : event.currentTarget.value === "true",
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
                    dispatch({
                      type: "SET_MUNICIPALITY_FILTER",
                      text: event.currentTarget.value,
                    });
                  }}
                />
              </Table.Th>
              <Table.Th>
                <Button
                  size="xs"
                  onClick={(event) => {
                    dispatch({ type: "RESET_FILTER" });
                    setOrder("name");
                    setPage(1);
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
                    <Text>
                      <Anchor href={"/companies/" + company.id}>
                        {company.name}
                      </Anchor>
                    </Text>
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
                    <Group>
                      <Tooltip label="Podrobnosti o firmě">
                        <ActionIcon
                          variant="light"
                          component={Link}
                          href={"/companies/" + company.id}
                        >
                          <IconInfoSmall />
                        </ActionIcon>
                      </Tooltip>{" "}
                      {session?.user ? (
                        <Tooltip label="Založení praxe">
                          <ActionIcon
                            variant="light"
                            component={Link}
                            href={"/internships/create?company=" + company.id}
                            color="green"
                            aria-label="Založení praxe"
                          >
                            <IconClockPlus />
                          </ActionIcon>
                        </Tooltip>
                      ) : null}{" "}
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
          onChange={(page) => /*setPage(page)*/ setPage(page)}
        />
      </Flex>
    </>
  );
};

export default CompaniesTable;
