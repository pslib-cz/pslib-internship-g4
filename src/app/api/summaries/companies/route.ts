import { type NextRequest } from "next/server";
import prisma from "@/utils/db";
import { Prisma } from "@prisma/client";

type AggregatedData = {
  [companyId: number]: {
    companyName: string;
    totalStudents: Set<string>;
  };
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const setId = searchParams.get("set")
    ? parseInt(searchParams.get("set")!)
    : null;
  const active = searchParams.get("active") === "true";

  // Sestavení filtru na základě parametrů
  const filters: any = {};
  if (setId !== null) {
    filters.setId = setId;
  }
  if (active) {
    filters.set = { active: true }; // Přidáme filtr na aktivní sady
  }

  if (setId !== null && isNaN(setId)) {
    return Response.json({ error: "Invalid setId parameter" }, { status: 400 });
  }

  if (
    searchParams.get("active") &&
    searchParams.get("active") !== "true" &&
    searchParams.get("active") !== "false"
  ) {
    return Response.json(
      { error: "Invalid active parameter" },
      { status: 400 },
    );
  }

  // Načtení dat
  const internships = await prisma.internship.findMany({
    where: filters,
    select: {
      companyId: true,
      company: {
        select: {
          name: true,
        },
      },
      userId: true,
    },
  });

  // Ruční agregace v JavaScriptu
  const aggregation = internships.reduce<AggregatedData>((acc, internship) => {
    if (!internship.companyId || !internship.company) {
      return acc; // Ochrana proti záznamům bez přiřazené firmy
    }

    if (!acc[internship.companyId]) {
      acc[internship.companyId] = {
        companyName: internship.company.name,
        totalStudents: new Set(),
      };
    }
    acc[internship.companyId].totalStudents.add(internship.userId);
    return acc;
  }, {});

  // Formátování výsledku
  const formattedResult = Object.entries(aggregation)
    .map(([companyId, data]: any) => ({
      companyId: parseInt(companyId),
      companyName: data.companyName,
      totalStudents: data.totalStudents.size,
    }))
    .sort((a, b) => {
      if (b.totalStudents !== a.totalStudents) {
        // Primární řazení podle počtu studentů (sestupně)
        return b.totalStudents - a.totalStudents;
      }
      // Sekundární řazení podle názvu firmy (vzestupně)
      return a.companyName.localeCompare(b.companyName);
    });

  return Response.json(formattedResult);
}