import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Diary } from "@prisma/client";
import { ListResult } from "@/types/data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const internshipId = searchParams.get("internship");
  const orderBy = searchParams.get("orderBy");
  const page: number | null =
    searchParams.get("page") !== null
      ? parseInt(searchParams.get("page") ?? "")
      : null;
  const size: number | null =
    searchParams.get("size") !== null
      ? parseInt(searchParams.get("size") ?? "")
      : null;
  let summary = await prisma.diary.aggregate({
    _count: true,
    where: {
      internshipId: {
        equals: internshipId || undefined,
      },
    },
  });

  let internship = await prisma.internship.findUnique({
    where: {
      id: internshipId || undefined,
    },
  });
  if (!internship) {
    return new Response("Internship not found", {
      status: 404,
    });
  }

  let diaries: Diary[] = await prisma.diary.findMany({
    where: {
      internshipId: {
        equals: internshipId || undefined,
      },
    },
    orderBy: {
      date: orderBy === "date" ? "asc" : "desc",
    },
    skip: page !== null && size !== null ? page * size : undefined,
    take: size !== null ? size : undefined,
  });
  let result: ListResult<Diary> = {
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
  });
  return Response.json(diary, { status: 201 });
}
