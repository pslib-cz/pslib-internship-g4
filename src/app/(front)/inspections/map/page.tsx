"use client";

import { Suspense, useMemo } from "react";
import { Anchor, LoadingOverlay, Box } from "@mantine/core";
import dynamic from "next/dynamic";

const Page = () => {
  const MapDisplay = useMemo(
    () =>
      dynamic(() => import("./MapDisplay"), {
        loading: () => <LoadingOverlay />,
        ssr: false,
      }),
    [],
  );
  return (
    <Box>
      <Suspense fallback={<LoadingOverlay />}>
        <MapDisplay />
      </Suspense>
    </Box>
  );
};

export default Page;
