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
    // Načtení dat a seskupení podle reservationUserId
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

    // Načtení odpovídajících uživatelů
    const userIds = reservations
      .map((res) => res.reservationUserId)
      .filter(Boolean) as string[];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, givenName: true, surname: true },
    });

    // Formátování výsledků
    const result = reservations.map((res) => {
      const user = users.find((u) => u.id === res.reservationUserId);
      return {
        reservationUserId: res.reservationUserId,
        count: res._count.reservationUserId,
        givenName: user?.givenName || "Neznámý",
        surname: user?.surname || "Uživatel",
      };
    });

    // Seřazení podle počtu praxí sestupně
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