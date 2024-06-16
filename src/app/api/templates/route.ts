import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Template } from "@prisma/client";
import { type ListResult } from "@/types/data";
import { Role } from "@/types/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
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

  let summary = await prisma.template.aggregate({
    _count: true,
    where: {
      name: {
        contains: name !== null ? name : undefined,
      },
    },
  });

  let templates = await prisma.template.findMany({
    where: {
      name: {
        contains: name !== null ? name : undefined,
      },
    },
    orderBy: {
      name:
        orderBy === "name"
          ? "asc"
          : orderBy === "name_desc"
            ? "desc"
            : undefined,
    },
    skip: page !== null && size !== null ? page * size : undefined,
    take: size !== null ? size : undefined,
  });
  let result: ListResult<Template> = {
    data: templates,
    count: templates.length,
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

  const template = await prisma.template.create({
    data: {
      name: body.name,
      content: body.content,
    },
  });
  return Response.json(template, { status: 201 });
}
