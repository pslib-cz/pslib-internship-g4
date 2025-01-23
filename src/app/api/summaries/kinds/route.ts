import { type NextRequest } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const setId = searchParams.get("set")
    ? parseInt(searchParams.get("set")!)
    : null;
  const active = searchParams.get("active") === "true";

  const filters: any = {};
  if (setId !== null) {
    filters.setId = setId;
  }
  if (active) {
    filters.set = { active: true };
  }

  try {
    // Načtení dat s agregací
    const kinds = await prisma.internship.groupBy({
      by: ["kind"],
      where: filters,
      _count: {
        kind: true,
      },
    });

    // Formátování výsledků
    const result = kinds.map((item) => ({
      kind: item.kind,
      count: item._count.kind,
    }));

    return Response.json(result);
  } catch (error) {
    console.error("Error fetching internship kinds:", error);
    return Response.json(
      { error: "Failed to fetch internship kinds" },
      { status: 500 },
    );
  }
}