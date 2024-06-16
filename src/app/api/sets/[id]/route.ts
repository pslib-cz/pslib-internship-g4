import { type NextRequest } from "next/server";
import { Set } from "@prisma/client";
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
  let set = await prisma.set.findFirst({
    where: {
      id: Number(id),
    },
  });
  if (!set) {
    return new Response("Set not Found", {
      status: 404,
    });
  }
  return Response.json(set);
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

  let set = await prisma.set.delete({
    where: {
      id: Number(id),
    },
  });
  if (!set) {
    return new Response("Set not Found", {
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
  body.start = new Date(body.start);
  body.end = new Date(body.end);
  body.year = Number(body.year);
  body.hoursDaily = Number(body.hoursDaily);
  body.daysTotal = Number(body.daysTotal);
  if (body.start > body.end) {
    return new Response("Start date is after end date", {
      status: 400,
    });
  }
  let set = await prisma.set.update({
    where: {
      id: Number(id),
    },
    data: body as Set,
  });
  if (!set) {
    return new Response("Set not Found", {
      status: 404,
    });
  }
  return Response.json(set);
}
