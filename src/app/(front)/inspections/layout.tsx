"use client";

import { ReactNode, useState } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { Tabs, Breadcrumbs, Anchor, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import isTeacher from "@/hocs/isTeacherClient";
import {
  ReservationProvider,
  ReservationContext,
} from "@/providers/InternshipReservationProvider";

export const InspectionsLayout = ({ children }: { children: ReactNode }) => {
  let segment = useSelectedLayoutSegment();
  let text;
  const router = useRouter();
  switch (segment) {
    case null:
      segment = "list";
      text = "Seznam";
      break;
    case "map":
      text = "Mapa";
      break;
    case "reservations":
      text = "Rezervace";
      break;
    case "overview":
      text = "Souhrn";
      break;
    default:
      text = "Detail";
      break;
  }
  const [activeTab, setActiveTab] = useState(segment);
  return (
    <>
      <Breadcrumbs separatorMargin="md" mt="xs">
        <Anchor component={Link} href="/">
          Titulní stránka
        </Anchor>
        <Anchor component={Link} href="/inspections">
          Kontroly
        </Anchor>
        <Text>{text}</Text>
      </Breadcrumbs>
      <Tabs value={activeTab} variant="outline">
        <Tabs.List mt="sm">
          <Tabs.Tab
            value="list"
            onClick={() => {
              router.push("/inspections");
              setActiveTab("list");
            }}
          >
            Seznam
          </Tabs.Tab>
          <Tabs.Tab
            value="map"
            onClick={() => {
              router.push("/inspections/map");
              setActiveTab("map");
            }}
          >
            Mapa
          </Tabs.Tab>
          <Tabs.Tab
            value="reservations"
            onClick={() => {
              router.push("/inspections/reservations");
              setActiveTab("reservations");
            }}
          >
            Rezervace
          </Tabs.Tab>
          <Tabs.Tab
            value="overview"
            onClick={() => {
              router.push("/inspections/overview");
              setActiveTab("overview");
            }}
          >
            Souhrn
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      {children}
    </>
  );
};

export default isTeacher(InspectionsLayout);
