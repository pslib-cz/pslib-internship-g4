import { type NextRequest } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const setId = searchParams.get("set")
    ? parseInt(searchParams.get("set")!)
    : null;
  const active = searchParams.get("active") === "true";

  const filters: Record<string, any> = {};
  if (setId !== null) {
    filters.setId = setId;
  }
  if (active) {
    filters.set = { active: true };
  }

  try {
    // Fetch data from the database
    const inspectionsSummary = await prisma.inspection.groupBy({
      by: ["inspectionUserId"],
      _count: { id: true },
      where: {
        internship: {
          set: filters.set || undefined,
        },
        ...filters,
      },
    });

    // Map data to include user details
    const result = await Promise.all(
      inspectionsSummary.map(async (summary) => {
        const user = await prisma.user.findUnique({
          where: { id: summary.inspectionUserId },
          select: { name: true, surname: true },
        });
        return {
          userId: summary.inspectionUserId,
          name: user?.name || "Unknown",
          surname: user?.surname || "",
          inspectionCount: summary._count.id,
        };
      }),
    );

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
