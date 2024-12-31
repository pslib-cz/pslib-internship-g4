import { type NextRequest } from "next/server";
import prisma from "@/utils/db";

type AggregatedData = {
  [classname: string]: {
    totalInternships: number;
    uniqueStudents: Set<string>;
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

  // Načtení dat
  const internships = await prisma.internship.findMany({
    where: filters,
    select: {
      classname: true,
      userId: true,
    },
  });

  // Ruční agregace v JavaScriptu
  const aggregation = internships.reduce<AggregatedData>((acc, internship) => {
    if (!acc[internship.classname]) {
      acc[internship.classname] = {
        totalInternships: 0,
        uniqueStudents: new Set(),
      };
    }
    acc[internship.classname].totalInternships += 1;
    acc[internship.classname].uniqueStudents.add(internship.userId);
    return acc;
  }, {});

  // Formátování výsledku
  const formattedResult = Object.entries(aggregation).map(
    ([classname, data]: any) => ({
      classname,
      totalInternships: data.totalInternships,
      uniqueStudents: data.uniqueStudents.size,
    }),
  );

  return Response.json(formattedResult);
}
