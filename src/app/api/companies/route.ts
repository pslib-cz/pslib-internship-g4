import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { CompanyWithLocation } from "@/types/entities";
import { type ListResult } from "@/types/data";
import { Role } from "@/types/auth";
import { Company } from "@prisma/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
  const taxNum = Number(searchParams.get("taxNum"));
  const search = searchParams.get("search");
  const act = searchParams.get("active");
  const mun = searchParams.get("municipality");
  const orderBy = searchParams.get("orderBy");
  const page: number | null =
    searchParams.get("page") !== null
      ? parseInt(searchParams.get("page") ?? "")
      : null;
  const size: number | null =
    searchParams.get("size") !== null
      ? parseInt(searchParams.get("size") ?? "")
      : null;
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  let summary = await prisma.company.aggregate({
    _count: true,
    where: {
      name: {
        contains:
          (name !== null ? name : undefined) ||
          (search !== null ? search : undefined),
      },
      companyIdentificationNumber: {
        equals: taxNum || undefined,
      },
      active: act === "true" ? true : act === "false" ? false : undefined,
      location: {
        municipality: {
          contains: mun !== null ? mun : undefined,
        },
      },
    },
  });

  let companies: CompanyWithLocation[] = await prisma.company.findMany({
    include: {
      location: true,
    },
    where: {
      name: {
        contains:
          (name !== null ? name : undefined) ||
          (search !== null ? search : undefined),
      },
      companyIdentificationNumber: {
        equals: taxNum || undefined,
      },
      active: act === "true" ? true : act === "false" ? false : undefined,
      location: {
        municipality: {
          contains: mun !== null ? mun : undefined,
        },
      },
    },
    orderBy: {
      name:
        orderBy === "name"
          ? "asc"
          : orderBy === "name_desc"
            ? "desc"
            : undefined,
      companyIdentificationNumber:
        orderBy === "taxNum"
          ? "asc"
          : orderBy === "taxNum_desc"
            ? "desc"
            : undefined,
    },
    skip: page !== null && size !== null ? page * size : undefined,
    take: size !== null ? size : undefined,
  });
  let result: ListResult<CompanyWithLocation> = {
    data: companies,
    count: companies.length,
    total: summary._count || 0,
    page: page,
    size: size,
  };
  return Response.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
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
  if (body.companyIdentificationNumber !== undefined) {
    let existingcompany: Company | null = await prisma.company.findFirst({
      where: { companyIdentificationNumber: body.companyIdentificationNumber },
    });
    if (existingcompany) {
      return new Response("Company already exists.", {
        status: 400,
      });
    }
  }
  const company = await prisma.company.create({
    data: {
      name: body.name,
      companyIdentificationNumber: body.companyIdentificationNumber,
      active: body.active,
      description: body.description,
      website: body.website,
      created: new Date(),
      creatorId: session.user.id,
      locationId: Number(body.locationId),
    },
  });
  return Response.json(company, { status: 201 });
}
