import { Box, Container, Grid, GridCol } from "@mantine/core";
import Link from "next/link";
import CompaniesSection from "./CompaniesSection";
import CreateInternshipSection from "./CreateInternshipSection";
import ApiOutputsSection from "./ApiOutputsSection";
import InternshipsSection from "./InternshipsSection";
import InspectionsSection from "./InspectionsSection";

const Page = () => {
  return (
    <>
      <CompaniesSection />
      <InternshipsSection />
      <InspectionsSection />
      <ApiOutputsSection />
    </>
  );
};

export default Page;
