import { type NextRequest } from "next/server";
import { User } from "@prisma/client";
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
  const censored =
    session.user.role !== Role.ADMIN &&
    session.user.role !== Role.TEACHER &&
    session.user.id !== id;
  let user = await prisma.user.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: false,
      image: true,
      department: true,
      role: true,
      birthDate: !censored,
      phone: !censored,
      surname: true,
      givenName: true,
      street: !censored,
      descNo: !censored,
      orientNo: !censored,
      municipality: !censored,
      postalCode: !censored,
    },
  });
  if (!user) {
    return new Response("User not Found", {
      status: 404,
    });
  }
  return Response.json(user);
}

export async function DELETE(
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
  if (session.user.role !== Role.ADMIN) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  let user = await prisma.user.delete({
    where: {
      id: id,
    },
  });
  if (!user) {
    return new Response("User not Found", {
      status: 404,
    });
  }
  return new Response("Deleted", {
    status: 200,
  });
}

export async function PUT(
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
  if (session.user.role !== Role.ADMIN) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  const body = await request.json();
  console.log(body);
  if (body.birthDate) {
    body.birthDate = new Date(body.birthDate);
  }
  let user = await prisma.user.update({
    where: {
      id: id,
    },
    data: body as User,
  });
  if (!user) {
    return new Response("User not Found", {
      status: 404,
    });
  }
  return Response.json(user);
}
