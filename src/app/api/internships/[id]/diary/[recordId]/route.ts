import { Internship } from "@prisma/client";
import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";
import {
  InternshipFullRecord,
  InternshipWithCompanyLocationSetUser,
} from "@/types/entities";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; recordId: number } },
) {
  const id = params.id;
  const recId = Number(params.recordId);
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  let internship: InternshipFullRecord | null =
    await prisma.internship.findFirst({
      include: {
        set: true,
        user: true,
        company: {
          include: { location: true },
        },
        location: true,
        reservationUser: true,
      },
      where: { id: id },
    });
  if (!internship) {
    return new Response("Internship not found", {
      status: 404,
    });
  }

  if (
    session.user.role !== Role.ADMIN &&
    session.user.role !== Role.TEACHER &&
    session.user.id !== internship?.userId
  ) {
    return new Response("Forbidden", {
      status: 403,
    });
  }
  let diary = await prisma.diary.findFirst({
    where: { id: recId },
  });
  if (!diary) {
    return new Response("Record not found", {
      status: 404,
    });
  }

  return Response.json(diary);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; recordId: number } },
) {
  const session = await auth();
  const id = params.id;
  const recId = Number(params.recordId);

  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  let internship: InternshipFullRecord | null =
    await prisma.internship.findFirst({
      include: {
        set: true,
        user: true,
        company: {
          include: { location: true },
        },
        location: true,
        reservationUser: true,
      },
      where: { id: id },
    });
  if (!internship) {
    return new Response("Internship not found", {
      status: 404,
    });
  }
  if (
    session.user.role !== Role.ADMIN &&
    session.user.role !== Role.TEACHER &&
    session.user.id !== internship?.userId
  ) {
    return new Response("Forbidden", {
      status: 403,
    });
  }
  if (internship.set.active === false) {
    return new Response("Set of this internship is no longer active.", {
      status: 402,
    });
  }
  await prisma.diary.delete({
    where: { id: recId },
  });

  return new Response("Deleted", {
    status: 200,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; recordId: number } },
) {
  const session = await auth();
  const id = params.id;
  const recId = Number(params.recordId);

  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  let internship: InternshipFullRecord | null =
    await prisma.internship.findFirst({
      include: {
        set: true,
        user: true,
        company: {
          include: { location: true },
        },
        location: true,
        reservationUser: true,
      },
      where: { id: id },
    });
  if (!internship) {
    return new Response("Internship not found", {
      status: 404,
    });
  }

  if (
    session.user.role !== Role.ADMIN &&
    session.user.role !== Role.TEACHER &&
    session.user.id !== internship?.userId
  ) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  if (session.user.role !== Role.ADMIN && internship.set.active === false) {
    return new Response("Set of this internship is no longer active.", {
      status: 400,
    });
  }
  const body = await request.json();

  await prisma.diary.update({
    where: { id: recId },
    data: {
      date: new Date(body.date),
      text: body.text,
    },
  });
  return new Response("Updated", {
    status: 200,
  });
}
