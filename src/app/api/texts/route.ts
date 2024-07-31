import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { TextWithAuthor } from "@/types/entities";
import { type ListResult } from "@/types/data";
import { Role } from "@/types/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get("title") ? searchParams.get("title") : null;
  const author = searchParams.get("author") ? searchParams.get("author") : null;
  const published: number | null = searchParams.get("published")
    ? parseInt(searchParams.get("published") ?? "")
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

  let summary = await prisma.text.aggregate({
    _count: true,
    where: {
      title: {
        contains: title !== null ? title : undefined,
      },
      published: {
        equals: published !== null ? published : undefined,
      },
      creator: {
        id: {
          equals: author !== null ? author : undefined,
        },
      },
    },
  });

  let texts = await prisma.text.findMany({
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
      title: {
        contains: title !== null ? title : undefined,
      },
      published: {
        equals: published !== null ? published : undefined,
      },
      creator: {
        id: {
          equals: author !== null ? author : undefined,
        },
      },
    },
    orderBy: {
      title:
        orderBy === "title"
          ? "asc"
          : orderBy === "title_desc"
            ? "desc"
            : undefined,
    },
    skip: page !== null && size !== null ? page * size : undefined,
    take: size !== null ? size : undefined,
  });
  let result: ListResult<TextWithAuthor> = {
    data: texts,
    count: texts.length,
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

  const text = await prisma.text.create({
    data: {
      title: body.title,
      content: body.content,
      published: body.published,
      priority: body.priority,
      shortable: body.shortable,
      created: new Date(),
      updated: new Date(),
      creatorId: session.user.id,
    },
  });
  return Response.json(text, { status: 201 });
}
