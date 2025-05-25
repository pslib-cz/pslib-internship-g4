import { type NextRequest } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const setId = searchParams.get("set")
    ? parseInt(searchParams.get("set")!)
    : null;
  const active = searchParams.get("active") === "true";

  try {
    const filters = {
      internship: {
        ...(setId !== null ? { setId: setId } : {}),
        ...(active ? { set: { active: true } } : {}),
      },
    };
    // Fetch summary
    const inspectionsSummary = await prisma.inspection.groupBy({
      by: ["inspectionUserId"],
      _count: { id: true },
      where: filters,
    });

    // Získání všech uživatelů jedním dotazem
    const userIds = inspectionsSummary.map(
      (summary) => summary.inspectionUserId,
    );
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, givenName: true, surname: true },
    });

    // Vytvoření mapy uživatelů pro rychlé přiřazení
    const userMap = new Map(users.map((user) => [user.id, user]));

    // Výstup s přidanými detaily uživatelů
    const result = inspectionsSummary.map((summary) => ({
      userId: summary.inspectionUserId,
      givenName: userMap.get(summary.inspectionUserId)?.givenName || "",
      surname: userMap.get(summary.inspectionUserId)?.surname || "",
      count: summary._count.id,
    }));

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
