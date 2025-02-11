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
    select: { locationId: true },
  });

  if (!internship) {
    return new Response("Internship not found", { status: 404 });
  }

  return Response.json({ locationId: internship.locationId });
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
    return new Response("Internship not found", { status: 404 });
  }

  if (
    session.user.role !== Role.ADMIN &&
    session.user.role !== Role.TEACHER &&
    (session.user.id !== internship.userId ||
      internship.state !== InternshipState.IN_PROGRESS)
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  const body = await request.json();

  if (!body.locationId || typeof body.locationId !== "number") {
    return new Response("Invalid data: locationId must be a number", {
      status: 400,
    });
  }

  await prisma.internship.update({
    where: { id: id },
    data: { locationId: body.locationId },
  });

  return new Response(JSON.stringify({ message: "Location updated" }), {
    status: 200,
  });
}
