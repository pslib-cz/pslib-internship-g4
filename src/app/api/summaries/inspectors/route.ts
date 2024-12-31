import { type NextRequest } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
  try {
    // Agregace kontrol podle inspectionUserId
    const inspections = await prisma.inspection.groupBy({
      by: ["inspectionUserId"],
      where: {
        inspectionUserId: {
          not: undefined, // Pouze záznamy s přiřazeným učitelem
        },
      },
      _count: {
        inspectionUserId: true, // Počet kontrol na učitele
      },
    });

    // Načtení jmen učitelů
    const userIds = inspections.map((insp) => insp.inspectionUserId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, givenName: true, surname: true },
    });

    // Formátování výsledků
    const result = inspections
      .map((insp) => {
        const user = users.find((u) => u.id === insp.inspectionUserId);
        return {
          inspectionUserId: insp.inspectionUserId,
          count:
            typeof insp._count === "object"
              ? insp._count.inspectionUserId ?? 0
              : 0,
          givenName: user?.givenName || "Neznámé",
          surname: user?.surname || "Uživatel",
        };
      })
      .sort((a, b) => b.count - a.count); // Seřazení podle počtu kontrol sestupně

    return Response.json(result);
  } catch (error) {
    console.error("Error fetching inspections summary:", error);
    return Response.json(
      { error: "Failed to fetch inspections summary" },
      { status: 500 },
    );
  }
}
