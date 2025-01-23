import { type NextRequest } from "next/server";
import prisma from "@/utils/db";
import { InspectionResult } from "@/types/data";

export async function GET(request: NextRequest) {
  try {
    // Načtení dat s agregací podle result
    const results = await prisma.inspection.groupBy({
      by: ["result"],
      _count: {
        result: true,
      },
    });

    // Formátování výsledků
    const formattedResults = Object.values(InspectionResult)
      .filter((value) => typeof value === "number") // Vyfiltrovat číselné hodnoty z enumu
      .map((key) => {
        const matchingResult = results.find((r) => r.result === key);
        return {
          result: key,
          label:
            InspectionResult[key as unknown as keyof typeof InspectionResult],
          count: matchingResult?._count.result || 0,
        };
      });

    return Response.json(formattedResults);
  } catch (error) {
    console.error("Error fetching inspection results summary:", error);
    return Response.json(
      { error: "Failed to fetch inspection results summary" },
      { status: 500 },
    );
  }
}