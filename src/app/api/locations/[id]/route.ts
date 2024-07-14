import { type NextRequest } from "next/server";
import { Location } from "@prisma/client";
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
  let location: Location | null = await prisma.location.findFirst({
    where: { id: id },
  });
  if (!location) {
    return new Response("Location not Found", {
      status: 404,
    });
  }
  return Response.json(location);
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

  let location = await prisma.location.delete({
    where: {
      id: Number(id),
    },
  });
  if (!location) {
    return new Response("Location not Found", {
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
  let location = await prisma.location.update({
    where: {
      id: Number(id),
    },
    data: body as Location,
  });
  if (!location) {
    return new Response("Location not Found", {
      status: 404,
    });
  }
  return Response.json(location);
}
