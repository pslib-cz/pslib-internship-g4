import { type NextRequest } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const setId = searchParams.get("set")
    ? parseInt(searchParams.get("set")!)
    : null;
  const active = searchParams.get("active") === "true";

  // --- Filtry ---
  const filters: any = {};
  if (setId !== null) {
    filters.setId = setId;
  }
  if (active) {
    filters.set = { active: true };
  }

  try {
    // --- 1. Skupiny rezervací podle učitele ---
    const reservations = await prisma.internship.groupBy({
      by: ["reservationUserId"],
      where: {
        reservationUserId: { not: null },
        ...filters,
      },
      _count: {
        reservationUserId: true,
      },
    });

    // --- 2. Načtení kontrol – jen z rezervovaných praxí ---
    const relevantInternships = await prisma.internship.findMany({
      where: {
        reservationUserId: { not: null },
        ...filters,
      },
      select: {
        id: true,
        reservationUserId: true,
      },
    });

    const internshipIds = relevantInternships.map((i) => i.id);
    const reservationMap = new Map<string, Set<string>>();

    // --- 3. Najít kontroly pro tyto praxe ---
    const inspections = await prisma.inspection.findMany({
      where: {
        internshipId: { in: internshipIds },
      },
      select: {
        internshipId: true,
      },
    });

    // --- 4. Mapování: učitel → množina zkontrolovaných praxí ---
    const internshipToUser = new Map(
      relevantInternships.map((i) => [i.id, i.reservationUserId!]),
    );

    for (const inspection of inspections) {
      const userId = internshipToUser.get(inspection.internshipId);
      if (!userId) continue;

      if (!reservationMap.has(userId)) {
        reservationMap.set(userId, new Set());
      }
      reservationMap.get(userId)!.add(inspection.internshipId);
    }

    // --- 5. Uživatelské údaje ---
    const userIds = reservations
      .map((res) => res.reservationUserId)
      .filter(Boolean) as string[];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, givenName: true, surname: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    // --- 6. Výstup ---
    const result = reservations.map((res) => {
      const user = userMap.get(res.reservationUserId!);
      const inspectedCount =
        reservationMap.get(res.reservationUserId!)?.size ?? 0;

      return {
        userId: res.reservationUserId!,
        givenName: user?.givenName ?? "Neznámý",
        surname: user?.surname ?? "Uživatel",
        count: res._count.reservationUserId,
        inspected: inspectedCount,
      };
    });

    // Seřazení podle počtu rezervací sestupně
    result.sort((a, b) => b.count - a.count);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching reservation summary:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch reservation summary" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}