import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Set } from "@prisma/client";
import { type ListResult } from "@/types/data";
import { Role } from "@/types/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
  const active = searchParams.get("active");
  const year = Number(searchParams.get("year"));
  const continuous = searchParams.get("continuous");
  const template = searchParams.get("template");
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

  let summary = await prisma.set.aggregate({
    _count: true,
    where: {
      name: {
        contains: name !== null ? name : undefined,
      },
      active: active === "true" ? true : active === "false" ? false : undefined,
      continuous:
        continuous === "true"
          ? true
          : continuous === "false"
            ? false
            : undefined,
      year: {
        equals: year || undefined,
      },
    },
  });

  let sets = await prisma.set.findMany({
    where: {
      name: {
        contains: name !== null ? name : undefined,
      },
      active: active === "true" ? true : active === "false" ? false : undefined,
      continuous:
        continuous === "true"
          ? true
          : continuous === "false"
            ? false
            : undefined,
      year: {
        equals: year || undefined,
      },
    },
    orderBy: {
      name:
        orderBy === "name"
          ? "asc"
          : orderBy === "name_desc"
            ? "desc"
            : undefined,
      year:
        orderBy === "year"
          ? "asc"
          : orderBy === "year_desc"
            ? "desc"
            : undefined,
    },
    skip: page !== null && size !== null ? page * size : undefined,
    take: size !== null ? size : undefined,
  });
  let result: ListResult<Set> = {
    data: sets,
    count: sets.length,
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
  let start = new Date(body.start);
  let end = new Date(body.end);
  if (start > end) {
    return new Response("Start date must be before end date", {
      status: 400,
    });
  }
  const set = await prisma.set.create({
    data: {
      name: body.name,
      schoolName: body.schoolName,
      active: body.active,
      start: new Date(body.start),
      end: new Date(body.end),
      representativeName: body.representativeName,
      representativeEmail: body.representativeEmail,
      representativePhone: body.representativePhone,
      year: body.year,
      continuous: body.continuous,
      hoursDaily: Number(body.hoursDaily),
      daysTotal: Number(body.daysTotal),
      templateId: Number(body.templateId),
    },
  });
  return Response.json(set, { status: 201 });
}
