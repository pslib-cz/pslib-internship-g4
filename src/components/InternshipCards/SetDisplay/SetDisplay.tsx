"use client";

import { InternshipFullRecord } from "@/types/entities";
import { Title, Text } from "@mantine/core";
import { DateTime } from "@/components";

const SetDisplay = ({ data }: { data: InternshipFullRecord }) => {
  return (
    <>
      <Title order={2}>Termíny</Title>
      <Text fw={700}>Začátek</Text>
      <Text>
        <DateTime date={data.set.start} locale="cs" />
      </Text>
      <Text fw={700}>Konec</Text>
      <Text>
        <DateTime date={data.set.end} locale="cs" />
      </Text>
      <Text fw={700}>Druh</Text>
      <Text>{data.set.continuous ? "průběžná" : "souvislá"}</Text>
      <Text fw={700}>Počet dní celkem</Text>
      <Text>{data.set.daysTotal}</Text>
      <Text fw={700}>Hodin denně</Text>
      <Text>{data.set.hoursDaily}</Text>
    </>
  );
};

export default SetDisplay;
