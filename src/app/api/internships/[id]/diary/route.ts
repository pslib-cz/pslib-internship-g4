import { type NextRequest } from "next/server";
import { Diary } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { type ListResult } from "@/types/data";
import { Role } from "@/types/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  const session = await auth();
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date");
  const orderBy = searchParams.get("orderBy");
  const page: number | null =
    searchParams.get("page") !== null
      ? parseInt(searchParams.get("page") ?? "")
      : null;
  const size: number | null =
    searchParams.get("size") !== null
      ? parseInt(searchParams.get("size") ?? "")
      : null;

  let internship = await prisma.internship.findFirst({
    where: { id: id },
  });
  if (!internship) {
    return new Response("Internship not found", {
      status: 404,
    });
  }

  let summary = await prisma.diary.aggregate({
    _count: true,
    where: {
      internshipId: {
        equals: id ?? undefined,
      },
    },
  });

  let records: Diary[] = await prisma.diary.findMany({
    where: {
      internshipId: {
        equals: id ?? undefined,
      },
    },
    orderBy: [
      {
        created:
          orderBy === "created"
            ? "asc"
            : orderBy === "created_desc"
              ? "desc"
              : undefined,
      },
    ],
    skip: page !== null && size !== null ? page * size : undefined,
    take: size !== null ? size : undefined,
  });

  let result: ListResult<Diary> = {
    data: records,
    count: records.length,
    total: summary._count || 0,
    page: page,
    size: size,
  };
  return Response.json(result);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const body = await request.json();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  let isManager =
    session.user.role !== Role.ADMIN && session.user.role !== Role.TEACHER;
  if (
    session.user.role !== Role.ADMIN &&
    session.user.role !== Role.TEACHER &&
    session.user.id !== body.userId
  ) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  return new Response(JSON.stringify(null), { status: 201 });
}
