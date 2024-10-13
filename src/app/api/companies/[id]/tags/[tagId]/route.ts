import { CompanyTag } from "@prisma/client";
import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number; tagId: number } },
) {
  const session = await auth();
  const id = Number(params.id);
  const tag = Number(params.tagId);

  let ct: CompanyTag | null = await prisma.companyTag.findFirst({
    include: {
      tag: true,
      company: true,
    },
    where: { companyId: id, tagId: tag },
  });
  if (!ct) {
    return new Response("Not found", {
      status: 404,
    });
  }
  return Response.json(ct);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number; tagId: number } },
) {
  const session = await auth();
  const id = Number(params.id);
  const tag = Number(params.tagId);

  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  if (session.user.role !== "admin") {
    return new Response("Forbidden", {
      status: 403,
    });
  }
  let ct: CompanyTag | null = await prisma.companyTag.findFirst({
    where: { companyId: id, tagId: tag },
  });
  if (!ct) {
    return new Response("Not found", {
      status: 404,
    });
  }
  await prisma.companyTag.delete({
    where: { companyId_tagId: { companyId: id, tagId: tag } },
  });
  return new Response(JSON.stringify({ companyId: id, tagId: tag }), {
    status: 200,
  });
}
