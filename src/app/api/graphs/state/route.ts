import { type NextRequest } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const setId = searchParams.get("set")
    ? parseInt(searchParams.get("set")!)
    : null;
  const active = searchParams.get("active") === "true";

  // Validace parametrů
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

  // Sestavení filtru
  const filters: any = {};
  if (setId !== null) {
    filters.setId = setId;
  }
  if (active) {
    filters.set = { active: true };
  }

  try {
    // Celkový počet praxí
    const total = await prisma.internship.count({
      where: filters,
    });

    // Praxe s rezervací
    const reserved = await prisma.internship.count({
      where: {
        ...filters,
        reservationUserId: { not: null },
      },
    });

    // Praxe, které mají alespoň jednu kontrolu
    const inspected = await prisma.internship.count({
      where: {
        ...filters,
        inspections: {
          some: {
            result: { not: null }, // můžeme upravit na `id: { not: null }` pokud `result` není povinný
          },
        },
      },
    });

    return Response.json({
      total,
      reserved,
      inspected,
    });
  } catch (error) {
    console.error("Error fetching internship status summary:", error);
    return Response.json(
      { error: "Failed to fetch internship status summary" },
      { status: 500 },
    );
  }
}
