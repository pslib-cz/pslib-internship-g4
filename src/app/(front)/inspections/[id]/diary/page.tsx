"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import DiaryTable from "./DiaryTable";
import { LoadingOverlay, Box, Button, Title } from "@mantine/core";
import Link from "next/link";

const Page = ({ params }: { params: { id: string } }) => {
    const id = params.id;
    return (
        <>
        <Title mt="sm" order={2}>Deník praxe</Title>
        <Box>
            <Button variant="default" component={Link} href={`/inspections/${id}`}>Podrobnosti o praxi</Button>
        </Box>
        <Suspense fallback={<LoadingOverlay />}>
        <DiaryTable internshipId={id} />
        </Suspense>
        </>
    );
}

export default Page;