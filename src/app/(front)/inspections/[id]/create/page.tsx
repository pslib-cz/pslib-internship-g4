"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { LoadingOverlay, Container, Button, Title } from "@mantine/core";
import Link from "next/link";
import CreateInspectionForm from "./CreateInspectionForm";

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  return (
    <Container>
      <Title mt="sm" order={2}>
        Nová kontrola
      </Title>
      <Suspense fallback={<LoadingOverlay visible />}>
        <CreateInspectionForm internshipId={id} />
      </Suspense>
    </Container>
  );
};

export default Page;
