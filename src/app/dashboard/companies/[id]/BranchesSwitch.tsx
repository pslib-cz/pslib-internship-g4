"use client";

import React, { Suspense, useState } from "react";
import { Box, Button, Title, Loader } from "@mantine/core";
import BranchesDisplay from "./BranchesDisplay";
import BranchesAdd from "./BranchesAdd";
import BranchesEdit from "./BranchesEdit";

export type displayMode = "LIST" | "CREATE" | "EDIT";

const BranchesSwitch = ({ id }: { id: number }) => {
  const [mode, setMode] = useState<displayMode>("LIST");
  const [locationId, setLocationId] = useState<number | null>(null);
  switch (mode) {
    case "LIST":
      return (
        <Suspense fallback={<Loader />}>
          <BranchesDisplay
            id={id}
            switchModeAction={(x) => setMode(x)}
            setEditIdAction={(x: number) => {
              setLocationId(x);
            }}
          />
          <Box mt="10">
            <Button onClick={() => setMode("CREATE")}>Přidat pobočku</Button>
          </Box>
        </Suspense>
      );
    case "CREATE":
      return (
        <>
          <Title order={3}>Přidání pobočky</Title>
          <BranchesAdd closeAction={() => setMode("LIST")} companyId={id} />
        </>
      );
    case "EDIT":
      return (
        <>
          <Title order={3}>Editace pobočky</Title>
          <BranchesEdit
            closeAction={() => setMode("LIST")}
            companyId={id}
            locationId={locationId}
          />
        </>
      );
  }
};

export default BranchesSwitch;
