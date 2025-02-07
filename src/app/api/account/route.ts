import { type NextRequest } from "next/server";
import { User } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  let user = await prisma.user.findFirst({
    where: { id: session.user?.id },
  });

  return Response.json(user);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const body = await request.json();
  if (typeof body.descNo === "string" && body.descNo.trim() === "") {
    body.descNo = null;
  } else if (!isNaN(Number(body.descNo))) {
    body.descNo = Number(body.descNo);
  }
  body.name = body.givenName + " " + body.surname;
  if (body.birthDate) {
    body.birthDate = new Date(body.birthDate).toISOString();
  }
  let user = await prisma.user.update({
    where: { id: session.user?.id },
    data: body as User,
  });
  if (!user) {
    return new Response("User not Found", {
      status: 404,
    });
  }
  return Response.json(user);
}
