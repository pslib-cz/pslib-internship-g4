"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  LoadingOverlay,
  Drawer,
  Flex,
  Stack,
  Text,
  Anchor,
  ScrollArea,
  Group,
  Button,
  Card,
  ActionIcon,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconInfoCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Icon } from "leaflet";
import { useSearchParams } from "next/navigation";
import { LocationWithInternships } from "@/types/entities";
import Link from "next/link";
import styles from "./MapDisplay.module.css";
import "leaflet/dist/leaflet.css";

type TMapState = {
  latitude: number;
  longitude: number;
  zoom: number;
};

type TMapLayerProps = {
  mapState: TMapState;
  setMapState: (state: TMapState) => void;
};

const MapLayer: React.FC<TMapLayerProps> = ({ mapState, setMapState }) => {
  const searchParams = useSearchParams();
  const key = process.env.NEXT_PUBLIC_MAPY_CZ_KEY;
  const map = useMapEvents({
    moveend: () => {
      setMapState({
        latitude: map.getCenter().lat,
        longitude: map.getCenter().lng,
        zoom: map.getZoom(),
      });
    },
  });
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lat", mapState.latitude.toString());
    params.set("lng", mapState.longitude.toString());
    params.set("zoom", mapState.zoom.toString());
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [mapState, searchParams]);
  return (
    <TileLayer
      attribution='<a href="https://api.mapy.cz/copyright" target="_blank"><img src="https://api.mapy.cz/img/api/logo.svg" height="18" /></a>'
      url={`https://api.mapy.cz/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${key}`}
    />
  );
};

const MapDisplay = () => {
  const searchParams = useSearchParams();
  const [mapState, setMapState] = useState<TMapState>({
    latitude: searchParams.get("lat")
      ? Number(searchParams.get("lat"))
      : Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_LATITUDE),
    longitude: searchParams.get("lng")
      ? Number(searchParams.get("lng"))
      : Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_LONGITUDE),
    zoom: searchParams.get("zoom")
      ? Number(searchParams.get("zoom"))
      : Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_ZOOM),
  });
  let ico = new Icon({
    iconUrl: "/images/pins/Map-Pin.svg",
    iconSize: [32, 32],
    iconAnchor: [0, 16],
    popupAnchor: [16, -16],
  });
  const [points, setPoints] = useState<LocationWithInternships[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [set, setSet] = useState<number | undefined>(undefined);
  const [active, setActive] = useState<boolean | undefined>(undefined);
  const [selected, setSelected] = useState<LocationWithInternships | null>(
    null,
  );
  const router = useRouter();

  const fetchData = useCallback(
    (set: number | undefined, active: boolean | undefined) => {
      setLoading(true);
      fetch(
        "/api/maps/internships?set=" +
          (set ?? "") +
          "&active=" +
          (active ?? ""),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          setPoints(data.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [],
  );

  useEffect(() => {
    fetchData(set, active);
  }, [set, active, fetchData]);

  const makeReservationsForUnreservedInLocation = useCallback(
    (locationId: number) => {
      setError(null);
      fetch(
        `/api/inspections/locations/${locationId}/reservations?active=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Došlo k chybě při zpracovávání dat.");
          }
          notifications.show({
            title: "Rezervace",
            message: "Praxe byly zarezervovány.",
            color: "green",
          });
          fetchData(set, active);
        })
        .catch((error) => {
          setError(error.message);
          notifications.show({
            title: "Chyba",
            message: "Při rezervaci praxí došlo k nějaké chybě.",
            color: "red",
          });
        })
        .finally(() => {});
    },
    [fetchData, set, active],
  );

  return (
    <>
      <LoadingOverlay visible={loading} />
      <MapContainer
        center={[mapState.latitude, mapState.longitude]}
        zoom={mapState.zoom ? mapState.zoom : 10}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <MapLayer mapState={mapState} setMapState={setMapState} />
        {points.map((point, index) => (
          <Marker
            key={point.id}
            position={[Number(point.latitude), Number(point.longitude)]}
            icon={ico}
            eventHandlers={{
              click: () => {
                setSelected(point);
              },
            }}
          ></Marker>
        ))}
      </MapContainer>
      <Drawer
        opened={selected != null}
        onClose={() => setSelected(null)}
        title="Rezervace ke kontrole"
        position="right"
        zIndex={1000}
        padding="md"
      >
        <Stack>
          <Text>Na tomto místě se nacházejí praxe:</Text>
          <ScrollArea>
            {selected && selected.internships.length > 0 ? (
              selected.internships.map((intern, index) => (
                <Card key={intern.id} shadow="xs" padding="sm" mb="sm">
                  <Group justify="space-between">
                    <Text fw={500}>
                      {intern.user.givenName + " " + intern.user.surname} (
                      {intern.classname ?? "?"})
                    </Text>
                    <ActionIcon
                      variant="light"
                      aria-label="Detail"
                      onClick={(e) => {
                        router.push("/inspections/" + intern.id, {
                          scroll: false,
                        });
                      }}
                    >
                      <IconInfoCircle
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {intern.company.name}
                  </Text>
                  {intern.reservationUser && (
                    <Text
                      size="sm"
                      c={intern.inspections.length === 0 ? "red" : "green"}
                    >
                      {intern.inspections.length === 0
                        ? "Rezervováno: "
                        : "Zkontrolováno: "}
                      {intern.reservationUser?.givenName +
                        " " +
                        intern.reservationUser?.surname}
                    </Text>
                  )}
                </Card>
              ))
            ) : (
              <Text>Žádné praxe</Text>
            )}
          </ScrollArea>
            <Button
              onClick={(e) => {
                if (selected) {
                  makeReservationsForUnreservedInLocation(selected.id);
                  setSelected(null);
                  fetchData(set, active);
                }
              }}
            >
              Zarezervovat
            </Button>
        </Stack>
      </Drawer>
    </>
  );
};

export default MapDisplay;
