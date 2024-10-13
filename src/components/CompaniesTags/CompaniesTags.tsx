"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Badge,
  Alert,
  rem,
  Modal,
  Text,
  Button,
  Group,
  NativeSelect,
  Flex,
} from "@mantine/core";
import { Tag } from "@prisma/client";
import { IconX, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

type CompaniesTagsProps = {
  companyId: number;
  editable: boolean;
};

const fetchData = (companyId: number) => {
  return fetch(`/api/companies/${companyId}/tags`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Při získávání dat o přiřazených značkách došlo k chybě.",
        );
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};

const fetchUnusedTags = (companyId: number) => {
  return fetch(`/api/companies/${companyId}/tags/unassigned`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Při získávání dat o nepřiřazených značkách došlo k chybě.",
        );
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};

const CompaniesTags = ({ companyId, editable }: CompaniesTagsProps) => {
  const FetchData = useCallback((cId: number) => {
    fetchData(cId)
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error);
      });
    fetchUnusedTags(cId)
      .then((data) => {
        setUnusedTags(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);
  const RemoveTag = useCallback(
    (tagId: number) => {
      fetch(`/api/companies/${companyId}/tags/${tagId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(() => {
          notifications.show({
            title: "Úspěch!",
            message: "Značka byla odstraněna.",
            color: "green",
          });
        })
        .catch((error) => {
          notifications.show({
            title: "Chyba!",
            message: "Odstraňování značky nebylo úspěšné." + error,
            color: "red",
          });
        })
        .finally(() => {
          FetchData(companyId);
        });
    },
    [companyId, FetchData],
  );
  const assignTag = useCallback(
    (tagId: number) => {
      fetch(`/api/companies/${companyId}/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagId: tagId }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(() => {
          notifications.show({
            title: "Úspěch!",
            message: "Značka byla přidána.",
            color: "green",
          });
          setTagId("");
        })
        .catch((error) => {
          notifications.show({
            title: "Chyba!",
            message: "Přidávání značky nebylo úspěšné.",
            color: "red",
          });
        })
        .finally(() => {
          FetchData(companyId);
        });
    },
    [companyId, FetchData],
  );
  const [data, setData] = useState<Tag[]>([]);
  const [unusedTags, setUnusedTags] = useState<Tag[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [modalOpened, setModalOpened] = useState<number | null>(null);
  const [tagId, setTagId] = useState<string>("");

  useEffect(() => {
    FetchData(companyId);
  }, [FetchData, companyId]);
  if (error) {
    return <Alert color="red">{error.message}</Alert>;
  }
  return (
    <>
      <Flex direction="row" wrap="wrap" gap="sm">
        {data.map((tag, index) => (
          <Badge
            key={index}
            c={tag.color}
            bg={tag.background}
            rightSection={
              editable ? (
                <IconX
                  style={{ width: rem(12), height: rem(12), cursor: "pointer" }}
                  onClick={(e) => setModalOpened(tag.id)}
                />
              ) : null
            }
          >
            {tag.text}
          </Badge>
        ))}
      </Flex>
      {data.length == 0 && <Text>Žádné značky</Text>}
      {editable && (
        <Flex
          mt="sm"
          gap="sm"
          justify="flex-start"
          align="flex-end"
          direction="row"
        >
          <NativeSelect
            label="Nová značka"
            data={[
              { value: "", label: "" },
              ...unusedTags.map((tag) => ({
                value: String(tag.id),
                label: tag.text,
              })),
            ]}
            value={tagId}
            onChange={(e) => setTagId(e.target.value)}
          />
          <Button
            variant="default"
            onClick={(e) => assignTag(Number(tagId))}
            disabled={tagId == ""}
          >
            Přidat
          </Button>
        </Flex>
      )}
      <Modal
        opened={modalOpened !== null}
        onClose={() => setModalOpened(null)}
        title="Odstranit značku"
        centered
      >
        <Text>Opravdu chcete tuto značku odstranit?</Text>
        <Group mt="xl">
          <Button
            onClick={() => {
              RemoveTag(modalOpened!);
              setModalOpened(null);
            }}
            color="red"
            leftSection={<IconTrash />}
          >
            Odstranit
          </Button>
          <Button variant="default" onClick={() => setModalOpened(null)}>
            Storno
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default CompaniesTags;
