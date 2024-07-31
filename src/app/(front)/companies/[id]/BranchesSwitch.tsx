"use client";

import React, { Suspense, useState } from "react";
import { Box, Button, Title, Loader } from "@mantine/core";
import BranchesDisplay from "./BranchesDisplay";
import BranchesAdd from "./BranchesAdd";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "@mantine/hooks";

export type displayMode = "LIST" | "CREATE";

const BranchesSwitch = ({ id }: { id: number }) => {
  const [mode, setMode] = useState<displayMode>("LIST");
  const { data: session, status } = useSession();
  const isMobile = useMediaQuery("(max-width: 50em)");
  switch (mode) {
    case "LIST":
      return (
        <Suspense fallback={<Loader />}>
          <BranchesDisplay id={id} switchModeAction={(x) => setMode(x)} />
        </Suspense>
      );
    case "CREATE":
      return (
        <>
          <Title order={3}>Přidání pobočky</Title>
          <BranchesAdd
            closeAction={session ? () => setMode("LIST") : () => null}
            companyId={id}
          />
        </>
      );
  }
};

export default BranchesSwitch;
