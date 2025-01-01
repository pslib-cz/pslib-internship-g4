import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { ListResult } from "@/types/data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const internshipId = searchParams.get("internship");
  const orderBy = searchParams.get("orderBy");
  const authorId = searchParams.get("authorId");
  const authorGivenName = searchParams.get("authorGivenName");
  const authorSurname = searchParams.get("authorSurname");
  const page: number | null =
    searchParams.get("page") !== null
      ? parseInt(searchParams.get("page") ?? "")
      : null;
  const size: number | null =
    searchParams.get("size") !== null
      ? parseInt(searchParams.get("size") ?? "")
      : null;

  const whereClause: any = {
    internshipId: internshipId || undefined,
    createdById: authorId || undefined,
    createdBy: {
      givenName: authorGivenName ? { contains: authorGivenName } : undefined,
      surname: authorSurname ? { contains: authorSurname } : undefined,
    },
  };

  let summary = await prisma.diary.aggregate({
    _count: true,
    where: whereClause,
  });

  let diaries = await prisma.diary.findMany({
    where: whereClause,
    include: {
      createdBy: {
        select: {
          id: true,
          givenName: true,
          surname: true,
        },
      },
    },
    orderBy: {
      date: orderBy === "date" ? "asc" : "desc",
    },
    skip: page !== null && size !== null ? page * size : undefined,
    take: size !== null ? size : undefined,
  });

  let result: ListResult<any> = {
    data: diaries,
    count: diaries.length,
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

  const internship = await prisma.internship.findUnique({
    where: {
      id: body.internshipId,
    },
  });
  if (!internship) {
    return new Response("Internship not found", {
      status: 404,
    });
  }

  const diary = await prisma.diary.create({
    data: {
      internshipId: body.internshipId,
      date: new Date(body.date),
      created: new Date(),
      createdById: session.user.id,
      text: body.text,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          givenName: true,
          surname: true,
        },
      },
    },
  });

  return Response.json(diary, { status: 201 });
}
