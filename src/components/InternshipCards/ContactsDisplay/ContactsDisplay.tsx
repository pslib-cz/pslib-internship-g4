"use client";

import React from "react";
import {
  InspectionWithInspectorAndInternship,
  InternshipFullRecord,
} from "@/types/entities";
import { Title, Text, Anchor } from "@mantine/core";
import Link from "next/link";

const ContactsDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <>
      <Title order={2}>Kontakty</Title>
      <Title order={3}>Zástupce firmy</Title>
      <Text>Člověk zastupující firmu a podepisující za ní smlouvu</Text>
      <Text fw={700}>Jméno a příjmení</Text>
      <Text>{data.companyRepName}</Text>
      <Text fw={700}>Email</Text>
      <Text>
        {data.companyRepEmail ? (
          <Anchor component={Link} href={`mailto:${data.companyRepEmail}`}>
            {data.companyRepEmail}
          </Anchor>
        ) : (
          "není"
        )}
      </Text>
      <Text fw={700}>Telefon</Text>
      <Text>
        {data.companyRepPhone ? (
          <Anchor component={Link} href={`tel:${data.companyRepPhone}`}>
            {data.companyRepPhone}
          </Anchor>
        ) : (
          "není"
        )}
      </Text>
      <Title order={3}>Kontaktní osoba</Title>
      <Text>Osoba řídící praxi studenta</Text>
      <Text fw={700}>Jméno a příjmení</Text>
      <Text>{data.companyMentorName}</Text>
      <Text fw={700}>Email</Text>
      <Text>
        {data.companyMentorEmail ? (
          <Anchor component={Link} href={`mailto:${data.companyMentorEmail}`}>
            {data.companyMentorEmail}
          </Anchor>
        ) : (
          "není"
        )}
      </Text>
      <Text fw={700}>Telefon</Text>
      <Text>
        {data.companyMentorPhone ? (
          <Anchor component={Link} href={`tel:${data.companyMentorPhone}`}>
            {data.companyMentorPhone}
          </Anchor>
        ) : (
          "není"
        )}
      </Text>
    </>
  );
};

export default ContactsDisplay;
