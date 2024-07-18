"use client";

import { useContext, useEffect, useState } from "react";
import { LoadingOverlay } from "@mantine/core";
import { FilterContext } from "@/providers/CompanyFilterProvider";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useSearchParams } from "next/navigation";
import { LocationForComaniesAndBranches } from "@/types/entities";
import Link from "next/link";
import styles from "./MapDisplay.module.css";
import "leaflet/dist/leaflet.css";
import pinIcon from "@/assets/pins/pin-default.svg";

const MapDisplay = () => {
  const searchParams = useSearchParams();
  let ico = new Icon({
    iconUrl: "/Map-Pin.svg",
    iconSize: [32, 32],
    iconAnchor: [0, 16],
    popupAnchor: [16, -16],
  });
  const latitude = searchParams.get("lat")
    ? Number(searchParams.get("lat"))
    : Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_LATITUDE);
  const longitude = searchParams.get("lng")
    ? Number(searchParams.get("lng"))
    : Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_LONGITUDE);
  const [state, dispatch] = useContext(FilterContext);
  const zoom = searchParams.get("zoom")
    ? Number(searchParams.get("zoom"))
    : Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_ZOOM);
  const key = process.env.NEXT_PUBLIC_MAPY_CZ_KEY;
  const [points, setPoints] = useState<LocationForComaniesAndBranches[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    fetch(
      "/api/maps/companies?name=" +
        state.filterName +
        "&municipality=" +
        state.filterMunicipality +
        "&taxNum=" +
        state.filterTaxNum +
        "&active=" +
        state.filterActive,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        setPoints(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [state]);
  return (
    <>
      <LoadingOverlay visible={loading} />
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='<a href="https://api.mapy.cz/copyright" target="_blank"><img src="https://api.mapy.cz/img/api/logo.svg" height="18" /></a>'
          url={`https://api.mapy.cz/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${key}`}
        />
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
