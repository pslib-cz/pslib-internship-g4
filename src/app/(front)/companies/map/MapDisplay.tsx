"use client";

import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { LoadingOverlay } from "@mantine/core";
import { FilterContext } from "@/providers/CompanyFilterProvider";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Icon } from "leaflet";
import { useSearchParams } from "next/navigation";
import { LocationForComaniesAndBranches } from "@/types/entities";
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
  const [state, dispatch] = useContext(FilterContext);

  const [points, setPoints] = useState<LocationForComaniesAndBranches[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    (
      name: string | undefined,
      tax: number | undefined,
      active: boolean | undefined,
      municipality: string | undefined,
      tags: number[] = [],
    ) => {
      setLoading(true);
      const tagsParam = tags.length > 0 ? `&tag=${tags.join(",")}` : "";
      fetch(
        `/api/maps/companies?name=${name ?? ""}&municipality=${municipality ?? ""}&taxNum=${
          tax ?? ""
        }&active=${active ?? ""}${tagsParam}`,
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
    fetchData(
      state.filterName,
      state.filterTaxNum,
      state.filterActive,
      state.filterMunicipality,
      state.filterTags,
    );
  }, [state, fetchData]);

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
          >
            <Popup>
              {point.companies.length > 0 ? (
                <>
                  <h3>Sídla firem</h3>
                  <ul>
                    {point.companies.map((company, index) => (
                      <li key={company.id}>
                        <Link href={`/companies/${company.id}`}>
                          {company.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {point.companyBranches.length > 0 ? (
                <>
                  <h3>Pobočky</h3>
                  <ul>
                    {point.companyBranches.map((branch, index) => (
                      <li key={index}>
                        <Link href={`/companies/${branch.companyId}`}>
                          {branch.name
                            ? branch.name + " (" + branch.company.name + ")"
                            : branch.company.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default MapDisplay;
