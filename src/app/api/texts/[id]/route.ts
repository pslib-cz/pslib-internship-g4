import { type NextRequest } from "next/server";
import { Text } from "@prisma/client";
import { TextWithAuthor } from "@/types/entities";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  const id = Number(params.id);

  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  let text: TextWithAuthor | null = await prisma.text.findFirst({
    select: {
      id: true,
      title: true,
      published: true,
      created: true,
      updated: true,
      content: true,
      shortable: true,
      priority: true,
      creator: {
        select: {
          id: true,
          givenName: true,
          surname: true,
        },
      },
    },
    where: {
      id: id,
    },
  });
  if (!text) {
    return new Response("Text not Found", {
      status: 404,
    });
  }
  return Response.json(text);
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

  let text = await prisma.text.delete({
    where: {
      id: Number(id),
    },
  });
  if (!text) {
    return new Response("Text not Found", {
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
  let text = await prisma.text.update({
    where: {
      id: Number(id),
    },
    data: body as Text,
  });
  if (!text) {
    return new Response("Text not Found", {
      status: 404,
    });
  }
  return Response.json(text);
}
