import { type NextRequest } from "next/server";
import { Inspection } from "@prisma/client";
import { auth } from "@/auth";
import { InspectionWithInspectorAndInternship } from "@/types/entities";
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

  if (
    session.user?.role !== Role.ADMIN &&
    session.user?.role !== Role.TEACHER
  ) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  let inspection: InspectionWithInspectorAndInternship | null =
    await prisma.inspection.findFirst({
      select: {
        id: true,
        date: true,
        note: true,
        result: true,
        kind: true,
        inspectionUser: {
          select: {
            id: true,
            givenName: true,
            surname: true,
            email: true,
            image: true,
          },
        },
        internship: {
          select: {
            id: true,
            classname: true,
            created: true,
            kind: true,
            highlighted: true,
            user: {
              select: {
                id: true,
                givenName: true,
                surname: true,
                email: true,
                image: true,
              },
            },
            company: {
              select: {
                id: true,
                name: true,
                companyIdentificationNumber: true,
                locationId: true,
              },
            },
          },
        },
      },
      where: { id: id },
    });
  if (!inspection) {
    return new Response("Not found", {
      status: 404,
    });
  }
  return Response.json(inspection);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  const session = await auth();
  const id = params.id;
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  if (
    session.user?.role !== Role.ADMIN &&
    session.user?.role !== Role.TEACHER
  ) {
    return new Response("Forbidden", {
      status: 403,
    });
  }
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  let inspection = await prisma.inspection.delete({
    where: {
      id: Number(id),
    },
  });
  if (!inspection) {
    return new Response("Company not Found", {
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

  if (
    session.user?.role !== Role.ADMIN &&
    session.user?.role !== Role.TEACHER
  ) {
    return new Response("Forbidden", {
      status: 403,
    });
  }
  const body = await request.json();
  let inspection = await prisma.inspection.update({
    where: {
      id: Number(id),
    },
    data: body as Inspection,
  });
  if (!inspection) {
    return new Response("Inspection not Found", {
      status: 404,
    });
  }
  return Response.json(inspection);
}
