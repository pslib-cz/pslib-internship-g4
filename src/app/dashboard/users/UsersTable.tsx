"use client";

import React, { FC, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Table,
  Button,
  ActionIcon,
  NativeSelect,
  Text,
  TextInput,
  Badge,
  Avatar,
  Modal,
  Group,
  Alert,
  Pagination,
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
import { User } from "@prisma/client";
import { roleTypes, getRoleLabel } from "@/data/lists";
import { type ListResult } from "@/types/data";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { RoleBadge } from "@/components";

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

const STORAGE_ID = "users-table";

const UsersTable: FC = (TUsersTableProps) => {
  const searchParams = useSearchParams();
  const [loadTableState, storeTableState, removeTableState] =
    useSessionStorage<TUsersTableState>(STORAGE_ID);
  const [data, setData] = useState<ListResult<User> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<TUsersTableState>({
    filterGivenName: "",
    filterSurname: "",
    filterRole: "",
    filterEmail: "",
    filterDepartment: "",
    order: "surname",
    page: 1,
    size: 10,
  });
  const [deleteOpened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const fetchData = useCallback(
    (
      givenName: string,
      surname: string,
      email: string,
      role: string,
      department: string,
      orderBy: string,
      page: number = 1,
      pageSize: number = 10,
    ) => {
      fetch(
        `/api/users?givenName=${givenName}&surname=${surname}&email=${email}&department=${department}&role=${role}&orderBy=${orderBy}&page=${page - 1}&size=${pageSize}`,
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
    const searchedGivenName = searchParams.get("givenName") ?? "";
    const searchedSurname = searchParams.get("surname") ?? "";
    const searchedRole = searchParams.get("role") ?? "";
    const searchedEmail = searchParams.get("email") ?? "";
    const searchedDepartment = searchParams.get("department") ?? "";
    const orderBy = searchParams.get("orderBy") ?? "surname";
    const paginationPage = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const paginationSize = searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10;
    let URLState: TUsersTableState = {
      filterGivenName: searchedGivenName,
      filterSurname: searchedSurname,
      filterRole: searchedRole,
      filterEmail: searchedEmail,
      filterDepartment: searchedDepartment,
      order: orderBy,
      page: paginationPage,
      size: paginationSize,
    };
    setState({ ...URLState });
  }, [searchParams, loadTableState]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    state.filterGivenName !== undefined &&
      params.set("givenName", state.filterGivenName);
    state.filterSurname !== undefined &&
      params.set("surname", state.filterSurname);
    state.filterRole !== undefined && params.set("role", state.filterRole);
    state.filterEmail !== undefined && params.set("email", state.filterEmail);
    state.filterDepartment !== undefined &&
      params.set("department", state.filterDepartment);
    params.set("page", state.page.toString());
    params.set("size", state.size.toString());
    params.set("orderBy", state.order);
    window.history.replaceState(null, "", `?${params.toString()}`);
    storeTableState(state);
    fetchData(
      state.filterGivenName,
      state.filterSurname,
      state.filterEmail,
      state.filterRole,
      state.filterDepartment,
      state.order,
      state.page,
      state.size,
    );
  }, [state, fetchData, searchParams, storeTableState]);

  return (
    <>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th></Table.Th>
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
              <Text
                fw={700}
                onClick={() => {
                  let newOrder =
                    state.order === "email" ? "email_desc" : "email";
                  setState({ ...state, order: newOrder });
                }}
                style={{ cursor: "pointer" }}
              >
                Email{" "}
                {state.order === "email" ? (
                  <IconChevronDown size={12} />
                ) : state.order === "email_desc" ? (
                  <IconChevronUp size={12} />
                ) : null}
              </Text>
            </Table.Th>
            <Table.Th>
              <Text
                fw={700}
                onClick={() => {
                  let newOrder = state.order === "role" ? "role_desc" : "role";
                  setState({ ...state, order: newOrder });
                }}
                style={{ cursor: "pointer" }}
              >
                Role{" "}
                {state.order === "role" ? (
                  <IconChevronDown size={12} />
                ) : state.order === "role_desc" ? (
                  <IconChevronUp size={12} />
                ) : null}
              </Text>
            </Table.Th>
            <Table.Th>
              <Text
                fw={700}
                onClick={() => {
                  let newOrder =
                    state.order === "department"
                      ? "department_desc"
                      : "department";
                  setState({ ...state, order: newOrder });
                }}
                style={{ cursor: "pointer" }}
              >
                Třída{" "}
                {state.order === "department" ? (
                  <IconChevronDown size={12} />
                ) : state.order === "department_desc" ? (
                  <IconChevronUp size={12} />
                ) : null}
              </Text>
            </Table.Th>
            <Table.Th>Možnosti</Table.Th>
          </Table.Tr>
          <Table.Tr>
            <Table.Th></Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterGivenName}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterGivenName: event.currentTarget.value,
                    page: 1,
                  });
                }}
              />
            </Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterSurname}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterSurname: event.currentTarget.value,
                    page: 1,
                  });
                }}
              />
            </Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterEmail}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterEmail: event.currentTarget.value,
                    page: 1,
                  });
                }}
              />
            </Table.Th>
            <Table.Th>
              <NativeSelect
                size="xs"
                value={state.filterRole}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterRole: event.currentTarget.value,
                    page: 1,
                  });
                }}
                data={[{ label: "Vše", value: "" }, ...roleTypes]}
              />
            </Table.Th>
            <Table.Th>
              <TextInput
                size="xs"
                value={state.filterDepartment}
                onChange={(event) => {
                  setState({
                    ...state,
                    filterDepartment: event.currentTarget.value,
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
                    filterGivenName: "",
                    filterSurname: "",
                    filterRole: "",
                    filterEmail: "",
                    filterDepartment: "",
                    order: "surname",
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
                Žádný uživatel nevyhovuje podmínkám.
              </Table.Td>
            </Table.Tr>
          )}
          {data &&
            data.data.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>
                  <Avatar
                    src={
                      user.image !== undefined && user.image !== null
                        ? "data:image/jpeg;base64, " + user.image
                        : null
                    }
                    radius="40"
                    size={40}
                  />
                </Table.Td>
                <Table.Td>
                  <Text>{user.givenName}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{user.surname}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{user.email}</Text>
                </Table.Td>
                <Table.Td>
                  <RoleBadge role={user?.role} />
                </Table.Td>
                <Table.Td>
                  <Text>{user.department}</Text>
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={"/dashboard/users/" + user.id}
                  >
                    <IconInfoSmall />
                  </ActionIcon>{" "}
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => {
                      setDeleteId(user.id);
                      open();
                    }}
                  >
                    <IconTrash />
                  </ActionIcon>{" "}
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={"/dashboard/tags/" + user.id + "/edit"}
                  >
                    <IconEdit />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
        </Table.Tbody>
        <Table.Tfoot>
          <Table.Tr>
            <Table.Td colSpan={100} ta="center">
              <Pagination
                total={Math.ceil((data?.total ?? 0) / (data?.size ?? 10))}
                value={(data?.page ?? 1) + 1}
                onChange={(page) => setState({ ...state, page: page })}
              />
            </Table.Td>
          </Table.Tr>
        </Table.Tfoot>
      </Table>
      <Modal
        opened={deleteOpened}
        centered
        onClose={close}
        size="auto"
        title="Odstranění uživatele"
        fullScreen={isMobile}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <Text>Opravdu si přejete tohoto uživatele odstranit?</Text>
        <Text fw={700}>Data pak už nebude možné obnovit.</Text>
        <Group mt="xl">
          <Button
            onClick={() => {
              if (deleteId !== null) {
                fetch("/api/users/" + deleteId, {
                  method: "DELETE",
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Chyba komunikace");
                    }
                    notifications.show({
                      title: "Povedlo se!",
                      message: "Uživatel byl odstraněn.",
                      color: "lime",
                    });
                    fetchData(
                      state.filterGivenName,
                      state.filterSurname,
                      state.filterRole,
                      state.filterEmail,
                      state.filterDepartment,
                      state.order,
                      state.page,
                      state.size,
                    );
                  })
                  .catch((error) => {
                    notifications.show({
                      title: "Chyba!",
                      message: "Smazání uživatele nebylo úspěšné.",
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

export default UsersTable;
