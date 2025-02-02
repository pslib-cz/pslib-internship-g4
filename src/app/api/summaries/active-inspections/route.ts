import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let userId = searchParams.get("userId");

  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // Pokud není userId v parametrech, použije se přihlášený uživatel
  if (!userId) {
    userId = session.user?.id;
  }

  // Pokud ani teď není userId dostupné, vrátí se chyba
  if (!userId) {
    return new Response("User ID is required", {
      status: 400,
    });
  }

  // Povolení přístupu jen administrátorům, učitelům, nebo danému uživateli
  if (
    session.user?.role !== Role.ADMIN &&
    session.user?.role !== Role.TEACHER &&
    session.user?.id !== userId
  ) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  try {
    const sets = await prisma.set.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        name: true,
        internships: {
          select: {
            id: true,
            reservationUserId: true,
            inspections: {
              select: {
                id: true,
                inspectionUserId: true,
              },
            },
          },
        },
      },
    });

    const result = sets.map((set) => {
      const totalInternships = set.internships.length;
      const reservedByUser = set.internships.filter(
        (internship) => internship.reservationUserId === userId,
      ).length;
      const checkedByUser = set.internships.reduce((count, internship) => {
        const inspectionsByUser = internship.inspections.filter(
          (inspection) => inspection.inspectionUserId === userId,
        ).length;
        return count + inspectionsByUser;
      }, 0);

      return {
        setId: set.id,
        setName: set.name,
        totalInternships,
        reservedByUser,
        checkedByUser,
      };
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching sets:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
