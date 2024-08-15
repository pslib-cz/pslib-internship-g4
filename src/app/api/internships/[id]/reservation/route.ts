import { Internship } from "@prisma/client";
import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  let internship = await prisma.internship.findFirst({
    include: {
      reservationUser: true,
    },
    where: { id: id },
  });

  if (!internship) {
    return new Response("Not found", {
      status: 404,
    });
  }
  if (session.user.role !== Role.ADMIN && session.user.role !== Role.TEACHER) {
    return new Response("Forbidden", {
      status: 403,
    });
  }
  return Response.json(internship.reservationUser);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  const id = params.id;

  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  let internship = await prisma.internship.findFirst({
    where: { id: id },
  });
  console.log(internship);

  if (!internship) {
    return new Response("Not found", {
      status: 404,
    });
  }
  if (session.user.role !== Role.ADMIN && session.user.role !== Role.TEACHER) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  if (internship.reservationUserId !== null) {
    return new Response("Already reserved", {
      status: 400,
    });
  }
  await prisma.internship.update({
    where: { id: id },
    data: {
      reservationUserId: session.user.id,
    },
  });
  return new Response(JSON.stringify({}), {
    status: 200,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  const id = params.id;

  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  let internship = await prisma.internship.findFirst({
    where: { id: id },
  });

  if (!internship) {
    return new Response("Not found", {
      status: 404,
    });
  }
  if (session.user.role !== Role.ADMIN && session.user.role !== Role.TEACHER) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  await prisma.internship.update({
    where: { id: id },
    data: {
      reservationUserId: null,
    },
  });
  return new Response(JSON.stringify({}), {
    status: 200,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  const id = params.id;

  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  let internship = await prisma.internship.findFirst({
    where: { id: id },
  });

  if (!internship) {
    return new Response("Not found", {
      status: 404,
    });
  }
  if (session.user.role !== Role.ADMIN && session.user.role !== Role.TEACHER) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  const body = await request.json();

  await prisma.internship.update({
    where: { id: id },
    data: {
      reservationUserId: body.reservationUserId,
    },
  });
  return new Response(JSON.stringify(body), {
    status: 200,
  });
}
