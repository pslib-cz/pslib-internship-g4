import { NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";
import { InternshipState } from "@/types/data";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  let internship = await prisma.internship.findFirst({
    where: { id: id },
    select: { conclusion: true, userId: true, state: true },
  });

  if (!internship) {
    return new Response("internship " + id + "not found", { status: 404 });
  }

  if (
    session.user.role !== Role.ADMIN &&
    session.user.role !== Role.TEACHER &&
    session.user.id !== internship.userId
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  return Response.json({ conclusion: internship.conclusion });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  const id = params.id;

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  let internship = await prisma.internship.findFirst({
    where: { id: id },
    select: { userId: true, state: true },
  });

  if (!internship) {
    return new Response("Not found", { status: 404 });
  }

  if (
    session.user.role !== Role.ADMIN &&
    session.user.role !== Role.TEACHER &&
    session.user.id !==
      internship.userId /*|| internship.state !== InternshipState.IN_PROGRESS*/
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  const body = await request.json();
  if (!body.conclusion || typeof body.conclusion !== "string") {
    return new Response("Invalid data", { status: 400 });
  }

  await prisma.internship.update({
    where: { id: id },
    data: { conclusion: body.conclusion },
  });

  return Response.json({ success: true });
}
