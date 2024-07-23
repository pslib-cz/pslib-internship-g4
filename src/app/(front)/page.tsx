import { Box, Container, Grid, GridCol } from "@mantine/core";
import Link from "next/link";
import CompaniesSection from "./CompaniesSection";
import CreateInternshipSection from "./CreateInternshipSection";
import ApiOutputsSection from "./ApiOutputsSection";
import InternshipsSection from "./InternshipsSection";

const Page = () => {
  return (
    <>
      <CompaniesSection />
      <CreateInternshipSection />
      <InternshipsSection />
      <ApiOutputsSection />
    </>
  );
};

export default Page;
