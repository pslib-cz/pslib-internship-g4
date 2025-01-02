"use client";

import React, { FC, useEffect, useState, useCallback, useContext } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Table,
  Button,
  ActionIcon,
  TextInput,
  Modal,
  Group,
  Alert,
  Pagination,
  Flex,
  NativeSelect,
  Text,
} from "@mantine/core";
import { IconTrash, IconEdit, IconInfoSmall } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { AccountDrawerContext } from "@/providers/AccountDrawerProvider";
import { SortableHeader } from "@/components";
import { type ListResult } from "@/types/data";
import {
  getInspectionResultLabel,
  getInspectionTypeLabel,
  inspectionResults,
  inspectionTypes,
} from "@/data/lists";

type TInspectionTableProps = {};
type TInspectionTableState = {
  filterInspectorGivenName: string;
  filterInspectorSurname: string;
  filterResult: string;
  filterKind: string;
  filterInternshipId: string;
  order: string;
  page: number;
  size: number;
};

const InspectionTable: FC<TInspectionTableProps> = () => {
  const searchParams = useSearchParams();
  const { pageSize: generalPageSize } = useContext(AccountDrawerContext);
  const [data, setData] = useState<ListResult<any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteOpened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const initialState: TInspectionTableState = {
    filterInspectorGivenName: searchParams.get("inspectorGivenName") ?? "",
    filterInspectorSurname: searchParams.get("inspectorSurname") ?? "",
    filterResult: searchParams.get("result") ?? "",
    filterKind: searchParams.get("kind") ?? "",
    filterInternshipId: searchParams.get("internshipId") ?? "",
    order: searchParams.get("orderBy") ?? "date",
    page: parseInt(searchParams.get("page") ?? "1"),
    size: parseInt(searchParams.get("size") ?? `${generalPageSize}`),
  };

  const [state, setState] = useState<TInspectionTableState>(initialState);

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (state.filterInspectorGivenName)
      params.set("inspectorGivenName", state.filterInspectorGivenName);
    if (state.filterInspectorSurname)
      params.set("inspectorSurname", state.filterInspectorSurname);
    if (state.filterResult) params.set("result", state.filterResult);
    if (state.filterKind) params.set("kind", state.filterKind);
    if (state.filterInternshipId)
      params.set("internshipId", state.filterInternshipId);
    params.set("orderBy", state.order);
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [state]);

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      inspectorGivenName: state.filterInspectorGivenName,
      inspectorSurname: state.filterInspectorSurname,
      result: state.filterResult,
      kind: state.filterKind,
      internshipId: state.filterInternshipId,
      orderBy: state.order,
      page: (state.page - 1).toString(),
      size: state.size.toString(),
    });

    fetch(`/api/inspections?${params.toString()}`)
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

  const handleInternshipClick = (internshipId: string) => {
    setState({
      ...state,
      filterInternshipId: internshipId,
      page: 1,
    });
  };

  useEffect(() => {
    updateURL();
    fetchData();
  }, [state, fetchData, updateURL]);

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <SortableHeader
                label="Datum"
                currentOrder={state.order}
                columnKey="date"
                onSort={(newOrder) => setState({ ...state, order: newOrder })}
              />
            </Table.Th>
            <Table.Th>ID praxe</Table.Th>
            <Table.Th>Jméno kontroléra</Table.Th>
            <Table.Th>Příjmení kontroléra</Table.Th>
            <Table.Th>Výsledek</Table.Th>
            <Table.Th>Druh</Table.Th>
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
                placeholder="Jméno"
                value={state.filterInspectorGivenName}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterInspectorGivenName: event.currentTarget.value,
                    page: 1,
                  })
                }
              />
            </Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                placeholder="Příjmení"
                value={state.filterInspectorSurname}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterInspectorSurname: event.currentTarget.value,
                    page: 1,
                  })
                }
              />
            </Table.Th>
            <Table.Th>
              <NativeSelect
                size="xs"
                data={[{ value: "", label: "- Vše -" }, ...inspectionResults]}
                value={state.filterResult}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterResult: event.currentTarget.value,
                    page: 1,
                  })
                }
              />
            </Table.Th>
            <Table.Th>
              <NativeSelect
                size="xs"
                data={[{ value: "", label: "- Vše -" }, ...inspectionTypes]}
                value={state.filterKind}
                onChange={(event) =>
                  setState({
                    ...state,
                    filterKind: event.currentTarget.value,
                    page: 1,
                  })
                }
              />
            </Table.Th>
            <Table.Th>
              <Button
                size="xs"
                onClick={() =>
                  setState({
                    filterInspectorGivenName: "",
                    filterInspectorSurname: "",
                    filterResult: "",
                    filterKind: "",
                    filterInternshipId: "",
                    order: "date",
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
          {loading && (
            <Table.Tr>
              <Table.Td colSpan={7}>Načítám data...</Table.Td>
            </Table.Tr>
          )}
          {error && (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Alert color="red">{error}</Alert>
              </Table.Td>
            </Table.Tr>
          )}
          {data?.data.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={7}>Žádné záznamy k zobrazení.</Table.Td>
            </Table.Tr>
          )}
          {data?.data.map((inspection) => (
            <Table.Tr key={inspection.id}>
              <Table.Td>
                {new Date(inspection.date).toLocaleDateString()}
              </Table.Td>
              <Table.Td>
                <Text
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() =>
                    handleInternshipClick(inspection.internship.id)
                  }
                >
                  {inspection.internship.id}
                </Text>
              </Table.Td>
              <Table.Td>{inspection.inspectionUser.givenName}</Table.Td>
              <Table.Td>{inspection.inspectionUser.surname}</Table.Td>
              <Table.Td>
                {getInspectionResultLabel(String(inspection.result))}
              </Table.Td>
              <Table.Td>
                {getInspectionTypeLabel(String(inspection.kind))}
              </Table.Td>
              <Table.Td>
                <ActionIcon
                  variant="light"
                  component={Link}
                  href={`/dashboard/inspections/${inspection.id}`}
                >
                  <IconInfoSmall />
                </ActionIcon>{" "}
                <ActionIcon
                  variant="light"
                  component={Link}
                  href={`/dashboard/inspections/${inspection.id}/edit`}
                >
                  <IconEdit />
                </ActionIcon>{" "}
                <ActionIcon
                  color="red"
                  onClick={() => {
                    setDeleteId(inspection.id);
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
          total={Math.ceil(
            (data?.total ?? 0) / (data?.size ?? generalPageSize)
          )}
          value={state.page}
          onChange={(page) => setState({ ...state, page })}
        />
      </Flex>
      <Modal
        opened={deleteOpened}
        onClose={close}
        title="Smazání kontroly"
        centered
        size="sm"
      >
        <Text>Opravdu chcete tuto kontrolu smazat?</Text>
        <Group mt="md">
          <Button
            color="red"
            onClick={() => {
              if (deleteId) {
                fetch(`/api/inspections/${deleteId}`, { method: "DELETE" })
                  .then((res) => {
                    if (!res.ok) {
                      throw new Error("Smazání selhalo");
                    }
                    notifications.show({
                      title: "Smazáno",
                      message: "Kontrola byla úspěšně smazána",
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

export default InspectionTable;