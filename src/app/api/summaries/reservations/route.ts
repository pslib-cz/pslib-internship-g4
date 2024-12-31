import { type NextRequest } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
  try {
    // Načtení dat a seskupení podle reservationUserId
    const reservations = await prisma.internship.groupBy({
      by: ["reservationUserId"],
      where: {
        reservationUserId: {
          not: null, // Pouze rezervované praxe
        },
      },
      _count: {
        reservationUserId: true, // Počet praxí na uživatele
      },
    });

    // Načtení jmen uživatelů a formátování dat
    const userIds = reservations
      .map((res) => res.reservationUserId)
      .filter((id): id is string => id !== null);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, givenName: true, surname: true },
    });

    const result = reservations
      .map((res) => {
        const user = users.find((u) => u.id === res.reservationUserId);
        return {
          reservationUserId: res.reservationUserId,
          count: res._count.reservationUserId,
          givenName: user?.givenName || "Neznámý",
          surname: user?.surname || "Uživatel",
        };
      })
      .sort((a, b) => b.count - a.count); // Seřazení podle počtu praxí sestupně

    return Response.json(result);
  } catch (error) {
    console.error("Error fetching reservation summary:", error);
    return Response.json(
      { error: "Failed to fetch reservation summary" },
      { status: 500 },
    );
  }
}
