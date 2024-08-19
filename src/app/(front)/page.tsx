import { Box, Container, Grid, GridCol } from "@mantine/core";
import Link from "next/link";
import CompaniesSection from "./CompaniesSection";
import CreateInternshipSection from "./CreateInternshipSection";
import ApiOutputsSection from "./ApiOutputsSection";
import InternshipsSection from "./InternshipsSection";
import InspectionsSection from "./InspectionsSection";
import TopCompaniesSection from "./TopCompaniesSection";
import TextsSection from "./TextsSection";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Titulní stránka",
};

const Page = () => {
  return (
    <>
      <CompaniesSection />
      <TextsSection />
      <Suspense fallback={<div>Loading...</div>}>
        <TopCompaniesSection />
      </Suspense>
    </>
  );
};

export default Page;
