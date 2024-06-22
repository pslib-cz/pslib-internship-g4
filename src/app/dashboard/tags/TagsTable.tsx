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
  Modal,
  Group,
  Alert,
  Pagination
} from "@mantine/core";
import { IconInfoSmall, IconTrash, IconEdit } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Tag } from "@prisma/client";
import { tagTypes, getTagLabel } from "@/data/lists";
import { type ListResult } from "@/types/data";

const TagsTable: FC = ({}) => {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ListResult<Tag> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterName, setFilterName] = useState<string>();
  const [filterType, setFilterType] = useState<string>();
  const [orderBy, setOrderBy] = useState("text");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [deleteOpened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const fetchData = useCallback(
    (text: string | undefined, type: string | undefined, orderBy: string, page: number = 1, pageSize: number = 10) => {
      fetch(`/api/tags?text=${text}&type=${type}&orderBy=${orderBy}&page=${page - 1}&size=${pageSize}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
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
    const params = new URLSearchParams(searchParams.toString());
    filterName !== undefined && params.set("name", filterName);
    filterType !== undefined && params.set("type", filterType);
    params.set("page", page.toString());
    params.set("size", pageSize.toString());
    params.set("orderBy", orderBy);
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [filterName, filterType, orderBy, searchParams, page, pageSize]);

  useEffect(() => {
    const searchedName = searchParams.get("name") ?? "";
    const searchedType = searchParams.get("type") ?? "";
    const orderBy = searchParams.get("orderBy") ?? "text";
    const paginationPage = searchParams.get("page") ? parseInt(searchParams.get("page") as string) : 1;
    const paginationSize = searchParams.get("size") ? parseInt(searchParams.get("size") as string) : 10;
    setFilterName(searchedName);
    setFilterType(searchedType);
    setOrderBy(orderBy);
    setPage(paginationPage);
    setPageSize(paginationSize);
    fetchData(searchedName, searchedType, orderBy, paginationPage, paginationSize);
  }, [searchParams, fetchData]);

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Text
                fw={700}
                onClick={() =>
                  setOrderBy(orderBy === "text" ? "text_desc" : "text")
                }
              >
                Text
              </Text>
            </Table.Th>
            <Table.Th>
              <Text fw={700}>Typ</Text>
            </Table.Th>
            <Table.Th>
              <Text fw={700}>Náhled</Text>
            </Table.Th>
            <Table.Th>Možnosti</Table.Th>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>
              <TextInput
                size="xs"
                value={filterName}
                onChange={(event) => {setFilterName(event.currentTarget.value); setPage(1)}}
              />
            </Table.Th>
            <Table.Th>
              <NativeSelect
                size="xs"
                value={filterType}
                onChange={(event) => {setFilterType(event.currentTarget.value); setPage(1)}}
                data={[{ label: "Vše", value: "" }, ...tagTypes]}
              />
            </Table.Th>
            <Table.Th></Table.Th>
            <Table.Th>
              <Button
                size="xs"
                onClick={(event) => {
                  setFilterName("");
                  setFilterType("");
                  setOrderBy("text");
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
                Žádná značka nevyhovuje podmínkám.
              </Table.Td>
            </Table.Tr>
          )}
          {data &&
            data.data.map((tag) => (
              <Table.Tr key={tag.id}>
                <Table.Td>
                  <Text>{tag.text}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{getTagLabel(String(tag.type))}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge c={tag.color} bg={tag.background}>
                    {tag.text}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={"/dashboard/tags/" + tag.id}
                  >
                    <IconInfoSmall />
                  </ActionIcon>{" "}
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => {
                      setDeleteId(tag.id);
                      open();
                    }}
                  >
                    <IconTrash />
                  </ActionIcon>{" "}
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={"/dashboard/tags/" + tag.id + "/edit"}
                  >
                    <IconEdit />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
        </Table.Tbody>
        <Table.Tfoot>
          <Table.Tr>
            <Table.Td colSpan={100}>
              <Pagination
                total={Math.ceil((data?.total ?? 0) / (data?.size ?? 10))}
                value={(data?.page ?? 1) + 1}
                onChange={(page) => setPage(page)} />
            </Table.Td>
          </Table.Tr>
        </Table.Tfoot>
      </Table>
      <Modal
        opened={deleteOpened}
        centered
        onClose={close}
        size="auto"
        title="Odstranění značky"
        fullScreen={isMobile}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <Text>Opravdu si přejete tuto značku odstranit?</Text>
        <Text fw={700}>Data pak už nebude možné obnovit.</Text>
        <Group mt="xl">
          <Button
            onClick={() => {
              if (deleteId !== null) {
                fetch("/api/tags/" + deleteId, {
                  method: "DELETE",
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                    notifications.show({
                      title: "Povedlo se!",
                      message: "Značka byla odstraněna.",
                      color: "lime",
                    });
                    fetchData(filterName, filterType, orderBy);
                  })
                  .catch((error) => {
                    notifications.show({
                      title: "Chyba!",
                      message: "Smazání značky nebylo úspěšné.",
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

export default TagsTable;