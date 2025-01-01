import { type NextRequest } from "next/server";
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
    return new Response("Unauthorized", { status: 401 });
  }

  const diary = await prisma.diary.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          id: true,
          givenName: true,
          surname: true,
          email: true,
        },
      },
    },
  });

  if (!diary) {
    return new Response("Diary entry not found", { status: 404 });
  }

  if (
    session.user?.role !== Role.ADMIN &&
    session.user?.role !== Role.TEACHER &&
    diary.createdById !== session.user.id
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  return Response.json(diary);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  const id = Number(params.id);
  const body = await request.json();
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const existingDiary = await prisma.diary.findUnique({
    where: { id },
  });

  if (!existingDiary) {
    return new Response("Diary entry not found", { status: 404 });
  }

  if (
    session.user?.role !== Role.ADMIN &&
    session.user?.role !== Role.TEACHER &&
    existingDiary.createdById !== session.user.id
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  const updatedDiary = await prisma.diary.update({
    where: { id },
    data: {
      text: body.text,
      date: new Date(body.date),
    },
  });

  return Response.json(updatedDiary);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  const id = Number(params.id);
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const existingDiary = await prisma.diary.findUnique({
    where: { id },
  });

  if (!existingDiary) {
    return new Response("Diary entry not found", { status: 404 });
  }

  if (
    session.user?.role !== Role.ADMIN &&
    session.user?.role !== Role.TEACHER &&
    existingDiary.createdById !== session.user.id
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  await prisma.diary.delete({
    where: { id },
  });

  return new Response("Deleted", { status: 200 });
}
