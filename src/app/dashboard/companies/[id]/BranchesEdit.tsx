"use client";

import React, { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { TextInput, Button, Group, NativeSelect } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Location, CompanyBranch } from "@prisma/client";

const BranchesEdit = ({
  closeAction,
  companyId,
  locationId,
}: {
  closeAction: () => void;
  companyId: number;
  locationId: number | null;
}) => {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [branch, setBranch] = useState<CompanyBranch | null>(null);
  const form = useForm<{
    name: string;
    locationId: string;
  }>({
    initialValues: {
      name: "",
      locationId: "",
    },
    validate: {
      locationId: (value) => (value ? null : "Místo musí být vybráno"),
    },
  });
  useEffect(() => {
    setLoading(true);
    fetch("/api/locations?orderBy=municipality")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setLocations(
          data.data.map((location: Location) => ({
            label: `${location.country}, ${location.municipality ?? "?"}, ${location.street ?? ""} ${location.descNo ?? ""} ${location.descNo && location.orientNo ? "/" : ""} ${location.orientNo ?? ""}`,
            value: location.id,
          })),
        );
      })
      .catch((error) => {
        notifications.show({
          title: "Chyba!",
          message: "Nepodařilo se načíst lokace.",
          color: "red",
        });
      });
    fetch(`/api/companies/${companyId}/locations/${locationId}`, {})
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setBranch(data);
        form.setFieldValue("name", data.name);
        form.setFieldValue("locationId", data.locationId.toString());
      })
      .catch((error) => {
        notifications.show({
          title: "Chyba!",
          message: "Nepodařilo se načíst pobočku.",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [companyId, locationId]);
  if (loading) {
    return <p>Načítám...</p>;
  }
  return (
    <form
      onSubmit={form.onSubmit(
        async (values: { name: string; locationId: string }) => {
          fetch(`/api/companies/${companyId}/locations/${locationId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: values.name,
              locationId: parseInt(values.locationId),
            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Při komunikaci se serverem došlo k chybě.");
              }
              notifications.show({
                title: "Povedlo se!",
                message: "Změny byly uloženy.",
                color: "lime",
              });
              closeAction();
            })
            .catch((error) => {
              notifications.show({
                title: "Chyba!",
                message: "Změny se nepodařilo uložit.",
                color: "red",
              });
            });
        },
      )}
    >
      <TextInput
        label="Název pobočky"
        placeholder="Pobočka Ljósálfheimr"
        {...form.getInputProps("name")}
      />
      <NativeSelect
        label="Adresa pobočky"
        description={`Pokud se zde adresa nenachází, musíte ji nejprve vytvořit v sekci Místa`}
        data={[{ label: "--", value: "" }, ...locations]}
        {...form.getInputProps("locationId")}
      />
      <Group justify="flex-start" mt="md">
        <Button type="submit">Přidat</Button>
        <Button variant="default" onClick={closeAction}>
          Zrušit
        </Button>
      </Group>
    </form>
  );
};

export default BranchesEdit;
