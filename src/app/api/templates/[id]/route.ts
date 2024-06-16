import { type NextRequest } from "next/server";
import { Template } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  const id = params.id;

  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  let template = await prisma.template.findFirst({
    where: {
      id: Number(id),
    },
  });
  if (!template) {
    return new Response("Template not Found", {
      status: 404,
    });
  }
  return Response.json(template);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  const id = params.id;

  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  if (session.user?.role !== Role.ADMIN) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  let template = await prisma.template.delete({
    where: {
      id: Number(id),
    },
  });
  if (!template) {
    return new Response("Template not Found", {
      status: 404,
    });
  }
  return new Response("Deleted", {
    status: 200,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  const id = params.id;
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  if (session.user?.role !== Role.ADMIN) {
    return new Response("Forbidden", {
      status: 403,
    });
  }
  const body = await request.json();
  let template = await prisma.template.update({
    where: {
      id: Number(id),
    },
    data: body as Template,
  });
  if (!template) {
    return new Response("Template not Found", {
      status: 404,
    });
  }
  return Response.json(template);
}
