import { type NextRequest } from "next/server";
import { Tag } from "@prisma/client";
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
  let tag = await prisma.tag.findFirst({
    where: {
      id: Number(id),
    },
  });
  if (!tag) {
    return new Response("Tag not Found", {
      status: 404,
    });
  }
  return Response.json(tag);
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

  let tag = await prisma.tag.delete({
    where: {
      id: Number(id),
    },
  });
  if (!tag) {
    return new Response("Tag not Found", {
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
  body.type = Number(body.type);
  let tag = await prisma.tag.update({
    where: {
      id: Number(id),
    },
    data: body as Tag,
  });
  if (!tag) {
    return new Response("Tag not Found", {
      status: 404,
    });
  }
  return Response.json(tag);
}
