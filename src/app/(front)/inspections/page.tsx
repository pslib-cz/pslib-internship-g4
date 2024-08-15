"use client";

import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Drawer } from "@mantine/core";
import InternshipsTable from "./InternshipsTable";

const Page = () => {
  return (
    <>
      <InternshipsTable />
    </>
  );
};

export default Page;
