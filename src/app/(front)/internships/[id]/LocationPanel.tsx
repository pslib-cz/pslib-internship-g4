import React, { FC, useEffect, useState } from "react";
import {
  Alert,
  Card,
  Group,
  Text,
  Title,
  LoadingOverlay,
  Button,
  Radio,
  Box,
  TextInput,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  InternshipFullRecord,
  InternshipWithCompanyLocationSetUser,
  CompanyBranchWithLocation,
} from "@/types/entities";
import { Location } from "@prisma/client";
import Address from "@/components/Address/Address";
import { notifications } from "@mantine/notifications";

enum DisplayMode {
  DISPLAY,
  BRANCHES,
  OTHER,
}

type LocationPanelProps = {
  internship: InternshipFullRecord | InternshipWithCompanyLocationSetUser;
  reloadInternshipCallback: () => void;
};

const LocationDisplay: FC<{
  locationId: number;
  companyLocationId: number;
  setMode: (mode: DisplayMode) => void;
  setLocation: (location: number) => void;
}> = ({ locationId, companyLocationId, setMode, setLocation }) => {
  const [loc, setLoc] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch(`/api/locations/${locationId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          setError("Došlo k chybě při získávání dat.");
          throw new Error("Při načítání dat o místě došlo k chybě.");
        }
        return response.json();
      })
      .then((data) => {
        setLoc(data);
      })
      .catch((error) => {
        setError(error.message);
        notifications.show({
          title: "Chyba!",
          message: "Nepodařilo se načíst místo firmy.",
          color: "red",
        });
      })
      .finally(() => {
        //console.log("LOCATION ID", locationId, location);
      });
  }, [locationId]);
  if (error) {
    return <Alert color="red">{error}</Alert>;
  }
  if (!loc) {
    return <LoadingOverlay />;
  }
  return (
    <>
      <Text fw={700}>Adresa</Text>
      <Address
        street={loc.street}
        municipality={loc.municipality ?? ""}
        descNum={loc.descNo}
        orientNum={loc.orientNo}
        country={loc.country ?? ""}
        postalCode={loc.postalCode}
      />
      <Text fw={700}>GPS</Text>
      <Text>
        {loc.latitude ? String(loc.latitude) : "?"},{" "}
        {loc.longitude ? String(loc.longitude) : "?"}
      </Text>
      <Group mt="1rem">
        <Button
          onClick={() => setLocation(companyLocationId)}
          variant="default"
        >
          Sídlo firmy
        </Button>
        <Button onClick={() => setMode(DisplayMode.BRANCHES)} variant="default">
          Pobočky
        </Button>
        <Button onClick={() => setMode(DisplayMode.OTHER)} variant="default">
          Nové místo
        </Button>
      </Group>
    </>
  );
};

const OtherDisplay: FC<{
  internship: InternshipFullRecord | InternshipWithCompanyLocationSetUser;
  setMode: (mode: DisplayMode) => void;
  setLocation: (location: number) => void;
}> = ({ internship, setMode, setLocation }) => {
  const form = useForm<{
    country: string;
    municipality: string | undefined;
    postalCode: number | undefined;
    street: string | undefined;
    descNo: number | undefined;
    orientNo: string;
    latitude: number | undefined;
    longitude: number | undefined;
  }>({
    initialValues: {
      country: "Česko",
      municipality: "",
      postalCode: undefined,
      street: "",
      descNo: undefined,
      orientNo: "",
      latitude: undefined,
      longitude: undefined,
    },
    validate: {
      country: (value) => (value.trim() !== "" ? null : "Stát je povinný"),
      postalCode: (value) => {
        if (value == undefined) return null;
        if (value < 10000 && value > 99999)
          return "PSČ musí být v rozmezí 00000 - 99999";
        return null;
      },
      municipality: (value: string | undefined) =>
        value === undefined || value.trim() !== "" ? null : "Obec je povinná",
    },
  });
  return (
    <>
      <Text fw={700}>Nové místo</Text>
      <form
        onSubmit={form.onSubmit(
          (values: {
            country: string;
            municipality: string | undefined;
            postalCode: number | undefined;
            street: string | undefined;
            descNo: number | undefined;
            orientNo: string;
            latitude: number | undefined;
            longitude: number | undefined;
          }) => {
            let latitude: number | undefined = undefined;
            let longitude: number | undefined = undefined;
            fetch(`/api/locations/geo`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                country: values.country,
                municipality: values.municipality,
                street: values.street ?? undefined,
                descNumber: values.descNo ? Number(values.descNo) : undefined,
                orientNumber: String(values.orientNo) ?? undefined,
                postalCode: values.postalCode ?? undefined,
              }),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then(
                (result: {
                  lat: number | undefined;
                  lon: number | undefined;
                }) => {
                  latitude = Number(result.lat) || undefined;
                  longitude = Number(result.lon) || undefined;
                  notifications.show({
                    title: "Povedlo se!",
                    message:
                      "Geokódování bylo úspěšné: " +
                      latitude +
                      ", " +
                      longitude +
                      ".",
                    color: "lime",
                  });
                },
              )
              .catch((error) => {
                notifications.show({
                  title: "Chyba!",
                  message: "Geokódování se nepodařilo.",
                  color: "red",
                });
              })
              .finally(() => {
                fetch(`/api/locations`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    country: values.country,
                    municipality: values.municipality,
                    postalCode: values.postalCode,
                    street: values.street ?? "",
                    orientNo: values.orientNo ?? "",
                    descNo: values.descNo ? Number(values.descNo) : undefined,
                    latitude: latitude,
                    longitude: longitude,
                  }),
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error(
                        "Chyba při přidávání adresy do databáze.",
                      );
                    }
                    return response.json();
                  })
                  .then((data) => {
                    notifications.show({
                      title: "Povedlo se!",
                      message: `Místo ${data.id} bylo vytvořeno nebo nalezeno.`,
                      color: "lime",
                    });
                    setLocation(data.id);
                    setMode(DisplayMode.DISPLAY);
                  })
                  .catch((error) => {
                    notifications.show({
                      title: "Chyba!",
                      message: "Nepodařilo se vytvořit nové místo.",
                      color: "red",
                    });
                  });
              });
          },
        )}
      >
        <TextInput
          label="Ulice"
          placeholder="Bifröst"
          {...form.getInputProps("street")}
        />
        <TextInput
          label="Číslo popisné"
          placeholder="1"
          {...form.getInputProps("descNo")}
        />
        <TextInput
          label="Číslo orientační"
          placeholder="1a"
          {...form.getInputProps("orientNo")}
        />
        <TextInput
          label="Obec"
          placeholder="Ljósálfheimr"
          {...form.getInputProps("municipality")}
        />
        <NumberInput
          label="PSČ"
          placeholder="00000"
          {...form.getInputProps("postalCode")}
        />
        <TextInput
          withAsterisk
          label="Stát"
          placeholder="Álfheimr"
          {...form.getInputProps("country")}
        />
        <Group mt="1rem">
          <Button variant="filled" type="submit">
            Vytvořit
          </Button>
          <Button
            onClick={() => setMode(DisplayMode.DISPLAY)}
            variant="default"
          >
            Zpět
          </Button>
        </Group>
      </form>
    </>
  );
};

const BranchesDisplay: FC<{
  internship: InternshipFullRecord | InternshipWithCompanyLocationSetUser;
  setMode: (mode: DisplayMode) => void;
  setLocation: (location: number) => void;
}> = ({ internship, setMode, setLocation }) => {
  const [branches, setBranches] = useState<CompanyBranchWithLocation[] | null>(
    [],
  );
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<number | null>(null);
  useEffect(() => {
    fetch(`/api/companies/${internship.companyId}/locations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          setBranches([]);
          setError("Došlo k chybě při získávání dat.");
          throw new Error("Při načítání seznamu poboček došlo k chybě.");
        }
        return response.json();
      })
      .then((data) => {
        setBranches(data);
      })
      .catch((error) => {
        setError(error.message);
        notifications.show({
          title: "Chyba!",
          message: "Nepodařilo se načíst pobočky firmy.",
          color: "red",
        });
      })
      .finally(() => {});
  }, [internship]);
  if (error) {
    return <Alert color="red">{error}</Alert>;
  }
  if (!branches) {
    return <LoadingOverlay />;
  }
  if (branches.length === 0) {
    return (
      <>
        <Alert color="blue">Firma nemá žádné pobočky.</Alert>
        <Group mt="1rem">
          <Button
            onClick={() => setMode(DisplayMode.DISPLAY)}
            variant="default"
          >
            Zpět
          </Button>
        </Group>
      </>
    );
  }
  return (
    <>
      <Text fw={700}>Seznam poboček</Text>
      <Text>Pro výběr místa praxe vyberte jednu z následujících poboček:</Text>
      <Box>
        {branches.map((branch) => (
          <Radio
            my="0.5em"
            key={branch.locationId}
            value={branch.locationId}
            checked={id === branch.locationId}
            onChange={() => setId(branch.locationId)}
            label={
              branch.name ? (
                <>
                  <Text fw="700">{branch.name}</Text>
                  <Address
                    street={branch.location.street}
                    municipality={branch.location.municipality ?? ""}
                    descNum={branch.location.descNo}
                    orientNum={branch.location.orientNo}
                    country={branch.location.country ?? ""}
                    postalCode={branch.location.postalCode}
                  />
                </>
              ) : (
                <Address
                  street={branch.location.street}
                  municipality={branch.location.municipality ?? ""}
                  descNum={branch.location.descNo}
                  orientNum={branch.location.orientNo}
                  country={branch.location.country ?? ""}
                  postalCode={branch.location.postalCode}
                />
              )
            }
          />
        ))}
      </Box>
      <Group mt="1rem">
        <Button
          disabled={id === null}
          onClick={() => {
            id && setLocation(id);
            setMode(DisplayMode.DISPLAY);
          }}
          variant="filled"
        >
          Vybrat
        </Button>
        <Button onClick={() => setMode(DisplayMode.DISPLAY)} variant="default">
          Zpět
        </Button>
      </Group>
    </>
  );
};

const LocationPanel: FC<LocationPanelProps> = ({
  internship,
  reloadInternshipCallback,
}) => {
  const [mode, setMode] = useState(DisplayMode.DISPLAY);
  const switchMode = (mode: DisplayMode) => {
    setMode(mode);
  };
  const setLocation = (locationId: number) => {
    //console.log("LOCATION ID::", locationId);
    fetch(`/api/internships/${internship.id}/location`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ locationId: locationId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        notifications.show({
          title: "Úspěch!",
          message: "Místo praxe bylo změněno na nové. (" + locationId + ")",
          color: "green",
        });
        reloadInternshipCallback();
      })
      .catch((error) => {
        console.error("Error:", error);
        notifications.show({
          title: "Chyba!",
          message: "Nepodařilo se změnit místo praxe.",
          color: "red",
        });
      });
  };
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Místo praxe</Title>
      {mode === DisplayMode.DISPLAY && (
        <LocationDisplay
          locationId={internship.locationId}
          companyLocationId={internship.company.locationId}
          setMode={switchMode}
          setLocation={setLocation}
        />
      )}
      {mode === DisplayMode.BRANCHES && (
        <BranchesDisplay
          internship={internship}
          setMode={switchMode}
          setLocation={setLocation}
        />
      )}
      {mode === DisplayMode.OTHER && (
        <OtherDisplay
          internship={internship}
          setMode={switchMode}
          setLocation={setLocation}
        />
      )}
    </Card>
  );
};

export default LocationPanel;
