import { Prisma, PrismaClient, CompanyTag, Tag, Company } from "@prisma/client";
import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";

export type CompanyBranchWithLocation = Prisma.CompanyBranchGetPayload<{
  include: { location: true };
}>;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  const session = await auth();
  const id = Number(params.id);

  let company: Company | null = await prisma.company.findFirst({
    where: { id: id },
  });
  if (!company) {
    return new Response("Not found", {
      status: 404,
    });
  }

  let tags: Tag[] | null = await prisma.tag.findMany({
    include: {
      assignedTags: true,
    },
    where: {
      assignedTags: {
        none: {
          companyId: id,
        },
      },
    },
    orderBy: {
      text: "asc",
    },
  });

  return Response.json(tags);
}
