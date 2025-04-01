"use client";

import React from "react";
import {
  InspectionWithInspectorAndInternship,
  InternshipFullRecord,
} from "@/types/entities";
import { Title, Text, Anchor } from "@mantine/core";
import Link from "next/link";
import Address from "@/components/Address/Address";

const StudentDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <>
      <Title order={2}>Student</Title>
      <Text fw={700}>Příjmení a jméno</Text>
      <Text>
        {data.user.surname}, {data.user.givenName}
      </Text>
      <Text fw={700}>Třída</Text>
      <Text>{data.classname ?? "není"}</Text>
      <Text fw={700}>Email</Text>
      <Text>
        {data.user.email ? (
          <Anchor component={Link} href={`mailto:${data.user.email}`}>
            {data.user.email}
          </Anchor>
        ) : (
          "není"
        )}
      </Text>
      <Text fw={700}>Telefon</Text>
      <Text>
        {data.user.phone ? (
          <Anchor component={Link} href={`tel:${data.user.phone}`}>
            {data.user.phone}
          </Anchor>
        ) : (
          "není"
        )}
      </Text>
      <Text fw={700}>Adresa</Text>
      <Text>
        <Address
          municipality={data.user.municipality ?? ""}
          street={data.user.street ?? "?"}
          descNum={data.user.descNo}
          orientNum={data.user.orientNo}
          country=""
          postalCode={data.user.postalCode}
        />
      </Text>
    </>
  );
};

export default StudentDisplay;
