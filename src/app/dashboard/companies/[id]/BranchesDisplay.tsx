"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableThead,
  TableTbody,
  TableTr,
  Text,
  Alert,
  ActionIcon,
  Modal,
  Group,
  Button,
} from "@mantine/core";
import { CompanyBranchWithLocation } from "@/types/entities";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import Address from "@/components/Address/Address";
import { notifications } from "@mantine/notifications";
import { IconInfoSmall, IconTrash, IconEdit } from "@tabler/icons-react";
import { displayMode } from "./BranchesSwitch";

const BranchesDisplay = ({
  id,
  switchModeAction,
  setEditIdAction,
}: {
  id: number;
  switchModeAction: (mode: displayMode) => void;
  setEditIdAction: (x: number) => void;
}) => {
  const [branches, setBranches] = useState<CompanyBranchWithLocation[] | null>(
    null,
  );
  const [error, setError] = useState<Error | null>(null);
  const [deleteOpened, { open, close }] = useDisclosure(false);
  const [locationId, setLocationId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 50em)");
  const fetchBranches = (companyId: number) => {
    fetch(`/api/companies/${companyId}/locations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Nepodařilo se načíst pobočky firmy");
      })
      .then((data) => {
        setBranches(data);
      })
      .catch((error) => {
        setError(error);
      });
  };
  useEffect(() => {
    fetchBranches(id);
  }, [id]);
  if (error) {
    return (
      <Alert color="red" title="Chyba">
        {error.message}
      </Alert>
    );
  }
  if (branches?.length === 0) {
    return <Text>Firma nemá žádné pobočky</Text>;
  }
  return (
    <>
      <Table>
        <TableThead>
          <TableTr>
            <Table.Th>Název</Table.Th>
            <Table.Th>Město</Table.Th>
            <Table.Th>Adresa</Table.Th>
            <Table.Th>Akce</Table.Th>
          </TableTr>
        </TableThead>
        <TableTbody>
          {branches?.map((branch, index) => (
            <TableTr key={index}>
              <Table.Td>{branch.name}</Table.Td>
              <Table.Td>{branch.location?.municipality ?? "?"}</Table.Td>
              <Table.Td>
                <Address
                  municipality={branch.location.municipality ?? ""}
                  street={branch.location.street ?? null}
                  country={branch.location.country ?? ""}
                  descNum={branch.location.descNo ?? null}
                  orientNum={branch.location.orientNo ?? null}
                  postalCode={branch.location.postalCode ?? null}
                />
              </Table.Td>
              <Table.Td>
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => {
                    setLocationId(branch.locationId);
                    open();
                  }}
                >
                  <IconTrash />
                </ActionIcon>{" "}
                <ActionIcon
                  variant="light"
                  onClick={() => {
                    setEditIdAction(branch.locationId);
                    switchModeAction("EDIT");
                  }}
                >
                  <IconEdit />
                </ActionIcon>
              </Table.Td>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
      <Modal
        opened={deleteOpened}
        centered
        onClose={close}
        size="auto"
        title="Odstranění pobočky"
        fullScreen={isMobile}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <Text>Opravdu si přejete tuto pobočku odstranit?</Text>
        <Text fw={700}>Data pak už nebude možné obnovit.</Text>
        <Group mt="xl">
          <Button
            onClick={() => {
              fetch("/api/companies/" + id + "/locations/" + locationId, {
                method: "DELETE",
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  notifications.show({
                    title: "Povedlo se!",
                    message: "Pobočka byla odstraněna.",
                    color: "lime",
                  });
                  fetchBranches(id);
                })
                .catch((error) => {
                  notifications.show({
                    title: "Chyba!",
                    message: "Smazání pobočky nebylo úspěšné.",
                    color: "red",
                  });
                })
                .finally(() => {
                  close();
                });
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

export default BranchesDisplay;
