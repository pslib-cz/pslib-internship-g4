import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Tag } from "@prisma/client";
import { type ListResult } from "@/types/data";
import { Role } from "@/types/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get("text");
  const tagType: number | null = searchParams.get("type")
    ? parseInt(searchParams.get("type") ?? "")
    : null;
  const orderBy = searchParams.get("orderBy");
  const page: number | null =
    searchParams.get("page") !== null
      ? parseInt(searchParams.get("page") ?? "")
      : null;
  const size: number | null =
    searchParams.get("size") !== null
      ? parseInt(searchParams.get("size") ?? "")
      : null;
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  let summary = await prisma.tag.aggregate({
    _count: true,
    where: {
      text: {
        contains: text !== null ? text : undefined,
      },
      type: {
        equals: tagType !== null ? tagType : undefined,
      },
    },
  });

  let tags = await prisma.tag.findMany({
    where: {
      text: {
        contains: text !== null ? text : undefined,
      },
      type: {
        equals: tagType !== null ? tagType : undefined,
      },
    },
    orderBy: {
      text:
        orderBy === "text"
          ? "asc"
          : orderBy === "text_desc"
            ? "desc"
            : undefined,
      type:
        orderBy === "type"
          ? "asc"
          : orderBy === "type_desc"
            ? "desc"
            : undefined,
    },
    skip: page !== null && size !== null ? page * size : undefined,
    take: size !== null ? size : undefined,
  });
  let result: ListResult<Tag> = {
    data: tags,
    count: tags.length,
    total: summary._count || 0,
    page: page,
    size: size,
  };
  return Response.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
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

  const tag = await prisma.tag.create({
    data: {
      text: body.text,
      type: Number(body.type),
      color: body.color,
      background: body.background,
    },
  });
  return Response.json(tag, { status: 201 });
}
