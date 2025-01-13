import { type NextRequest } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const setId = searchParams.get("set")
    ? parseInt(searchParams.get("set")!)
    : null;
  const active = searchParams.get("active") === "true";

  // Sestavení dynamických filtrů
  const filters: Record<string, any> = {};
  if (setId !== null) {
    filters.setId = setId;
  }
  if (active) {
    filters.set = { active: true };
  }

  try {
    // Agregace kontrol podle inspectionUserId
    const inspections = await prisma.inspection.groupBy({
      by: ["inspectionUserId"],
      where: {
        inspectionUserId: { not: null as any }, // Pouze záznamy s přiřazeným učitelem
        ...filters,
      },
      _count: {
        inspectionUserId: true, // Počet kontrol na učitele
      },
    });

    // Načtení odpovídajících uživatelů
    const userIds = inspections
      .map((insp) => insp.inspectionUserId)
      .filter(Boolean) as string[];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, givenName: true, surname: true },
    });

    // Formátování výsledků
    const result = inspections.map((insp) => {
      const user = users.find((u) => u.id === insp.inspectionUserId);
      return {
        inspectionUserId: insp.inspectionUserId,
        count:
          typeof insp._count === "object" && insp._count.inspectionUserId
            ? insp._count.inspectionUserId
            : 0,
        givenName: user?.givenName || "Neznámé",
        surname: user?.surname || "Uživatel",
      };
    });

    // Seřazení podle počtu kontrol sestupně
    result.sort((a, b) => b.count - a.count);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching inspections summary:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch inspections summary" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
