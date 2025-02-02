"use client";

import React, { useState, FC } from "react";
import ActiveSetSelector from "./ActiveSetSelector";
import InternshipClassCountTable from "./InternshipClassCountTable";
import CompaniesCountTable from "./CompaniesCountTable";
import InternshipKindCountTable from "./InternshipKindCountTable";
import { Paper, Title } from "@mantine/core";
import ReservationSummaryTable from "./ReservationsSummaryTable";
import InspectorSummaryTable from "./InspectorSummaryTable";
import InspectionResultsSummary from "./InspectionResultsSummary";

const OverviewContainer: FC = () => {
  const [activeSetId, setActiveSetId] = useState<number | null>(null);

  return (
    <>
      <Title order={1} mt="sm">
        Souhrnná data praxí
      </Title>
      <ActiveSetSelector
        activeSetId={activeSetId}
        setActiveSetId={setActiveSetId}
      />
      <Paper mt="lg" p="lg">
        <Title order={2}>Počty praxí a studentů podle tříd</Title>
        <InternshipClassCountTable setId={activeSetId} />
      </Paper>
      <Paper mt="lg" p="lg">
        <Title order={2}>Počty studentů v jednotlivých firmách</Title>
        <CompaniesCountTable setId={activeSetId} />
      </Paper>
      <Paper mt="lg" p="lg">
        <Title order={2}>Počty praxí podle druhu</Title>
        <InternshipKindCountTable setId={activeSetId} />
      </Paper>
      <Paper mt="lg" p="lg">
        <Title order={2}>Počty rezervovaných praxí</Title>
        <ReservationSummaryTable setId={activeSetId} />
      </Paper>
      <Paper mt="lg" p="lg">
        <Title order={2}>Počty kontrol podle učitelů</Title>
        <InspectorSummaryTable setId={activeSetId} />
      </Paper>
      <Paper mt="lg" p="lg">
        <Title order={2}>Počty kontrol podle výsledků</Title>
        <InspectionResultsSummary setId={activeSetId} />
      </Paper>
    </>
  );
};

export default OverviewContainer;
