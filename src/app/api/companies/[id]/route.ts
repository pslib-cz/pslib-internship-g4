import { type NextRequest } from "next/server";
import { Company } from "@prisma/client";
import { auth } from "@/auth";
import { CompanyWithLocationAndCreator } from "@/types/entities";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  const id = Number(params.id);

  const session = await auth();
  let company: CompanyWithLocationAndCreator | null =
    await prisma.company.findFirst({
      select: {
        id: true,
        name: true,
        companyIdentificationNumber: true,
        description: true,
        website: true,
        active: true,
        created: true,
        creator: {
          select: {
            id: true,
            givenName: true,
            surname: true,
            email: true,
          },
        },
        location: {
          select: {
            id: true,
            street: true,
            municipality: true,
            country: true,
            postalCode: true,
            descNo: true,
            orientNo: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      where: { id: id },
    });
  if (!company) {
    return new Response("Not found", {
      status: 404,
    });
  }
  return Response.json(company);
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

  let company = await prisma.company.delete({
    where: {
      id: Number(id),
    },
  });
  if (!company) {
    return new Response("Company not Found", {
      status: 404,
    });
  }
  return new Response(JSON.stringify({ tagId: id }), {
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
  body.locationId = body.locationId ? Number(body.locationId) : null;
  let website = body.website?.trim();
  if (
    website &&
    !website.startsWith("http://") &&
    !website.startsWith("https://")
  ) {
    website = "https://" + website;
  }
  let company = await prisma.company.update({
    where: {
      id: Number(id),
    },
    data: body as Company,
  });
  if (!company) {
    return new Response("Company not Found", {
      status: 404,
    });
  }
  return Response.json(company);
}
