import { CompanyTag } from "@prisma/client";
import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number; tagId: number } },
) {
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

  // Kontrola autorizace
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // Načtení značky z databáze
  let ct: CompanyTag | null = await prisma.companyTag.findFirst({
    where: { companyId: id, tagId: tag },
    include: { creator: true }, // Přidáno pro ověření tvůrce
  });

  if (!ct) {
    return new Response("Not found", {
      status: 404,
    });
  }

  if (session.user.role !== Role.ADMIN && ct.creatorId !== session.user.id) {
    return new Response(
      "Forbidden. You can only remove tags you had prevously assigned.",
      {
        status: 403,
      },
    );
  }

  // Smazání značky
  await prisma.companyTag.delete({
    where: { companyId_tagId: { companyId: id, tagId: tag } },
  });

  return new Response(JSON.stringify({ companyId: id, tagId: tag }), {
    status: 200,
  });
}
