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
import { auth } from "@/auth";
import { Role } from "@/types/auth";

export const metadata: Metadata = {
  title: "Titulní stránka",
};

const Page = async () => {
  const session = await auth();
  return (
    <>
      <CompaniesSection />
      <TextsSection />
      {session?.user?.role === Role.STUDENT && (
        <Suspense fallback={<div>Nahrávání...</div>}>
          <InternshipsSection />
        </Suspense>
      )}
      {(session?.user?.role === Role.ADMIN ||
        session?.user?.role === Role.TEACHER) && (
        <Suspense fallback={<div>Nahrávání...</div>}>
          <InspectionsSection />
        </Suspense>
      )}
      <Suspense fallback={<div>Nahrávání...</div>}>
        <TopCompaniesSection />
      </Suspense>
    </>
  );
};

export default Page;
