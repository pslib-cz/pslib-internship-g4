"use client";

import { ReactNode, useState, FC } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { Breadcrumbs, Anchor, Text, Tabs } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import isTeacher from "@/hocs/isTeacherClient";

type LayoutProps = {
  children?: React.ReactNode;
};

const InspectionsLayout = ({ children }: LayoutProps) => {
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
    case "diary":
      text = "Deník";
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
        <Anchor component={Link} href="/inspections" scroll={false}>
          Aktuální praxe
        </Anchor>
        <Text>{text}</Text>
      </Breadcrumbs>
      <Tabs value={activeTab} variant="outline">
        <Tabs.List mt="sm">
          <Tabs.Tab
            value="list"
            onClick={() => {
              setActiveTab("list");
              router.push("/inspections");
            }}
          >
            Seznam
          </Tabs.Tab>
          <Tabs.Tab
            value="map"
            onClick={() => {
              setActiveTab("map");
              router.push("/inspections/map");
            }}
          >
            Mapa
          </Tabs.Tab>
          <Tabs.Tab
            value="reservations"
            onClick={() => {
              setActiveTab("reservations");
              router.push("/inspections/reservations");
            }}
          >
            Rezervace
          </Tabs.Tab>
          <Tabs.Tab
            value="overview"
            onClick={() => {
              setActiveTab("overview");
              router.push("/inspections/overview");
            }}
          >
            Přehled
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      {children}
    </>
  );
};

export default isTeacher(InspectionsLayout);
