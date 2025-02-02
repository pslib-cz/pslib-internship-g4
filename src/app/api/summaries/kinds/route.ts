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

  try {
    const kinds = await prisma.internship.groupBy({
      by: ["kind"],
      where: filters,
      _count: {
        kind: true,
      },
    });

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
