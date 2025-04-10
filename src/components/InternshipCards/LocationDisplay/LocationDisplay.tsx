"use client";

import { InternshipFullRecord } from "@/types/entities";
import { Title, Text } from "@mantine/core";
import Address from "@/components/Address/Address";
import { Coordinates } from "@/components";

const LocationDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <>
      <Title order={2}>Lokalita</Title>
      <Text fw={700}>Adresa</Text>
      <Text>
        <Address
          municipality={data.location.municipality ?? ""}
          street={data.location.street ?? "?"}
          descNum={data.location.descNo}
          orientNum={data.location.orientNo}
          country=""
          postalCode={data.location.postalCode}
        />
      </Text>
      <Text fw={700}>Souřadnice</Text>
      <Text>
        <Coordinates
          latitude={data.location.latitude}
          longitude={data.location.longitude}
        />
      </Text>
    </>
  );
};

export default LocationDisplay;
