"use client";

import React, { FC, useEffect, useState, useCallback, useContext } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Table,
  Button,
  ActionIcon,
  NativeSelect,
  Text,
  TextInput,
  Avatar,
  Modal,
  Group,
  Alert,
  Pagination,
  ScrollArea,
  Flex,
  Tooltip,
} from "@mantine/core";
import { IconInfoSmall, IconTrash, IconEdit } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { AccountDrawerContext } from "@/providers/AccountDrawerProvider";
import { RoleBadge, SortableHeader } from "@/components";
import { User } from "@prisma/client";
import { roleTypes } from "@/data/lists";
import { type ListResult } from "@/types/data";

type TUsersTableProps = {};
type TUsersTableState = {
  filterGivenName: string;
  filterSurname: string;
  filterRole: string;
  filterEmail: string;
  filterDepartment: string;
  order: string;
  page: number;
  size: number;
};

const UsersTable: FC<TUsersTableProps> = () => {
  const searchParams = useSearchParams();
  const { pageSize: generalPageSize } = useContext(AccountDrawerContext);

  const initialState: TUsersTableState = {
    filterGivenName: searchParams.get("givenName") ?? "",
    filterSurname: searchParams.get("surname") ?? "",
    filterRole: searchParams.get("role") ?? "",
    filterEmail: searchParams.get("email") ?? "",
    filterDepartment: searchParams.get("department") ?? "",
    order: searchParams.get("orderBy") ?? "surname",
    page: parseInt(searchParams.get("page") ?? "1"),
    size: parseInt(searchParams.get("size") ?? `${generalPageSize}`),
  };

  const [state, setState] = useState<TUsersTableState>(initialState);
  const [data, setData] = useState<ListResult<User> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteOpened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    params.set("givenName", state.filterGivenName);
    params.set("surname", state.filterSurname);
    params.set("role", state.filterRole);
    params.set("email", state.filterEmail);
    params.set("department", state.filterDepartment);
    params.set("orderBy", state.order);
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [state]);

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      givenName: state.filterGivenName,
      surname: state.filterSurname,
      email: state.filterEmail,
      role: state.filterRole,
      department: state.filterDepartment,
      orderBy: state.order,
      page: (state.page - 1).toString(),
      size: state.size.toString(),
    });

    fetch(`/api/users?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Došlo k chybě při načítání dat.");
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
  }, [state, updateURL, fetchData]);

  return (
    <>
      <ScrollArea type="auto">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th></Table.Th>
              <Table.Th>
                <SortableHeader
                  label="Jméno"
                  currentOrder={state.order}
                  columnKey="givenName"
                  onSort={(newOrder) => setState({ ...state, order: newOrder })}
                />
              </Table.Th>
              <Table.Th>
                <SortableHeader
                  label="Příjmení"
                  currentOrder={state.order}
                  columnKey="surname"
                  onSort={(newOrder) => setState({ ...state, order: newOrder })}
                />
              </Table.Th>
              <Table.Th>
                <SortableHeader
                  label="Email"
                  currentOrder={state.order}
                  columnKey="email"
                  onSort={(newOrder) => setState({ ...state, order: newOrder })}
                />
              </Table.Th>
              <Table.Th>
                <SortableHeader
                  label="Role"
                  currentOrder={state.order}
                  columnKey="role"
                  onSort={(newOrder) => setState({ ...state, order: newOrder })}
                />
              </Table.Th>
              <Table.Th>
                <SortableHeader
                  label="Třída"
                  currentOrder={state.order}
                  columnKey="department"
                  onSort={(newOrder) => setState({ ...state, order: newOrder })}
                />
              </Table.Th>
              <Table.Th>Možnosti</Table.Th>
            </Table.Tr>
            <Table.Tr>
              <Table.Th></Table.Th>
              <Table.Th>
                <TextInput
                  size="xs"
                  value={state.filterGivenName}
                  onChange={(event) =>
                    setState({
                      ...state,
                      filterGivenName: event.currentTarget.value,
                      page: 1,
                    })
                  }
                />
              </Table.Th>
              <Table.Th>
                <TextInput
                  size="xs"
                  value={state.filterSurname}
                  onChange={(event) =>
                    setState({
                      ...state,
                      filterSurname: event.currentTarget.value,
                      page: 1,
                    })
                  }
                />
              </Table.Th>
              <Table.Th>
                <TextInput
                  size="xs"
                  value={state.filterEmail}
                  onChange={(event) =>
                    setState({
                      ...state,
                      filterEmail: event.currentTarget.value,
                      page: 1,
                    })
                  }
                />
              </Table.Th>
              <Table.Th>
                <NativeSelect
                  size="xs"
                  value={state.filterRole}
                  onChange={(event) =>
                    setState({
                      ...state,
                      filterRole: event.currentTarget.value,
                      page: 1,
                    })
                  }
                  data={[{ label: "Vše", value: "" }, ...roleTypes]}
                />
              </Table.Th>
              <Table.Th>
                <TextInput
                  size="xs"
                  value={state.filterDepartment}
                  onChange={(event) =>
                    setState({
                      ...state,
                      filterDepartment: event.currentTarget.value,
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
                      filterGivenName: "",
                      filterSurname: "",
                      filterRole: "",
                      filterEmail: "",
                      filterDepartment: "",
                      order: "surname",
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
                <Table.Td colSpan={7}>Žádný uživatel nevyhovuje podmínkám.</Table.Td>
              </Table.Tr>
            )}
            {data?.data.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>
                  <Avatar
                    src={
                      user.image
                        ? `data:image/jpeg;base64,${user.image}`
                        : null
                    }
                    radius="40"
                    size={40}
                  />
                </Table.Td>
                <Table.Td>{user.givenName}</Table.Td>
                <Table.Td>{user.surname}</Table.Td>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>
                  <RoleBadge role={user.role} />
                </Table.Td>
                <Table.Td>{user.department}</Table.Td>
                <Table.Td>
                  <Tooltip label="Podrobné informace">
                    <ActionIcon
                      variant="light"
                      component={Link}
                      href={`/dashboard/users/${user.id}`}
                    >
                      <IconInfoSmall />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Smazání">
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => {
                        setDeleteId(user.id);
                        open();
                      }}
                    >
                      <IconTrash />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Editace">
                    <ActionIcon
                      variant="light"
                      component={Link}
                      href={`/dashboard/users/${user.id}/edit`}
                    >
                      <IconEdit />
                    </ActionIcon>
                  </Tooltip>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      <Flex justify="center">
        <Pagination
          total={Math.ceil((data?.total ?? 0) / (data?.size ?? generalPageSize))}
          value={state.page}
          onChange={(page) => setState({ ...state, page })}
        />
      </Flex>
      <Modal
        opened={deleteOpened}
        onClose={close}
        title="Odstranění uživatele"
        centered
      >
        <Text>Opravdu chcete tohoto uživatele odstranit?</Text>
        <Group mt="md">
          <Button
            color="red"
            onClick={() => {
              if (deleteId) {
                fetch(`/api/users/${deleteId}`, { method: "DELETE" })
                  .then(() => {
                    notifications.show({
                      title: "Úspěch",
                      message: "Uživatel byl odstraněn.",
                      color: "green",
                    });
                    fetchData();
                  })
                  .catch(() =>
                    notifications.show({
                      title: "Chyba",
                      message: "Odstranění se nezdařilo.",
                      color: "red",
                    })
                  )
                  .finally(() => close());
              }
            }}
          >
            Smazat
          </Button>
          <Button onClick={close}>Zrušit</Button>
        </Group>
      </Modal>
    </>
  );
};

export default UsersTable;