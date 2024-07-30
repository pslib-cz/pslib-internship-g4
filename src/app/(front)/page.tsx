import { Box, Container, Grid, GridCol } from "@mantine/core";
import Link from "next/link";
import CompaniesSection from "./CompaniesSection";
import CreateInternshipSection from "./CreateInternshipSection";
import ApiOutputsSection from "./ApiOutputsSection";
import InternshipsSection from "./InternshipsSection";
import InspectionsSection from "./InspectionsSection";
import TextsSection from "./TextsSection";

const Page = () => {
  return (
    <>
      <CompaniesSection />
      <TextsSection />
      <InspectionsSection />
      <ApiOutputsSection />
    </>
  );
};

export default Page;
