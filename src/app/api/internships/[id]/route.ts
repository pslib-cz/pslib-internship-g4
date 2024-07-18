import { Internship, Prisma } from "@prisma/client";
import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";

export type InternshipWithUserLocationCompanySetInspector =
  Prisma.InternshipGetPayload<{
    include: {
      set: true;
      location: true;
      company: true;
      reservationUser: true;
      user: true;
    };
  }>;

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

  let internship: InternshipWithUserLocationCompanySetInspector | null =
    await prisma.internship.findFirst({
      include: {
        user: true,
        location: true,
        set: true,
        company: true,
        reservationUser: true,
      },
      where: { id: id },
    });
  if (!internship) {
    return new Response("Not found", {
      status: 404,
    });
  }
  // omezit osobní data mimo adminy a konkrétního studenta

  return Response.json(internship);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  const session = await auth();
  const id = Number(params.id);

  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  let internship: Internship | null = await prisma.internship.findFirst({
    where: { id: id },
  });

  if (!internship) {
    return new Response("Not found", {
      status: 404,
    });
  }

  if (session.user.role !== "admin" && session.user.id !== internship?.userId) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  // TODO omezit možnost smazat data, pokud není sada editovatelná

  await prisma.internship.delete({
    where: { id: id },
  });
  return new Response("Deleted", {
    status: 200,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  const session = await auth();
  const id = Number(params.id);

  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  if (session.user.role !== "admin") {
    return new Response("Forbidden", {
      status: 403,
    });
  }
  let internship: Internship | null = await prisma.internship.findFirst({
    where: { id: id },
  });
  if (!internship) {
    return new Response("Not found", {
      status: 404,
    });
  }
  if (session.user.role !== "admin" && session.user.id !== internship?.userId) {
    return new Response("Forbidden", {
      status: 403,
    });
  }
  // TODO omezit možnost editovat, pokud sada není editovatelná
  const body = await request.json();
  await prisma.internship.update({
    where: { id: id },
    data: body,
  });
  return new Response("Updated", {
    status: 200,
  });
}
