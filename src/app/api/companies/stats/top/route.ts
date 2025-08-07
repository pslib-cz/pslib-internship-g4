import { type NextRequest } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const amount: number =
    searchParams.get("amount") !== null
      ? parseInt(searchParams.get("amount") ?? "")
      : 10;
  let result = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: { internships: true },
      },
    },
    orderBy: [{ internships: { _count: "desc" } }, { name: "asc" }],
    take: amount,
  });
  return Response.json(result);
}
