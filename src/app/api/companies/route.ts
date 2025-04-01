import { type NextRequest } from "next/server";
import prisma from "@/utils/db";
import { auth } from "@/auth";
import { CompanyWithLocation } from "@/types/entities";
import { type ListResult } from "@/types/data";
import { Role } from "@/types/auth";
import { Company } from "@prisma/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
  const taxNum = searchParams.get("taxNum")
    ? Number(searchParams.get("taxNum"))
    : null;
  const search = searchParams.get("search");
  const act = searchParams.get("active");
  const mun = searchParams.get("municipality");
  const orderBy = searchParams.get("orderBy");
  const tagIds = searchParams.get("tag")?.split(",").map(Number) || []; // Načíst seznam tagů
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : null;
  const size = searchParams.get("size")
    ? parseInt(searchParams.get("size")!)
    : null;

  // Sestavení filtru
  const filters: any = {
    name: {
      contains: name ?? search ?? undefined,
    },
    companyIdentificationNumber: taxNum || undefined,
    active: act === "true" ? true : act === "false" ? false : undefined,
    location: {
      municipality: {
        contains: mun || undefined,
      },
    },
  };

  // Přidání filtrování podle tagů
  if (tagIds.length > 0) {
    filters.companyTags = {
      some: {
        tagId: {
          in: tagIds,
        },
      },
    };
  }

  // Dynamické řazení
  const sorting: any[] = [];
  if (orderBy === "name") sorting.push({ name: "asc" });
  if (orderBy === "name_desc") sorting.push({ name: "desc" });
  if (orderBy === "taxNum")
    sorting.push({ companyIdentificationNumber: "asc" });
  if (orderBy === "taxNum_desc")
    sorting.push({ companyIdentificationNumber: "desc" });

  // Souhrn
  const summary = await prisma.company.aggregate({
    _count: true,
    where: filters,
  });

  // Načtení dat
  const companies: CompanyWithLocation[] = await prisma.company.findMany({
    include: {
      location: true,
    },
    where: filters,
    orderBy: sorting.length > 0 ? sorting : undefined,
    skip: page !== null && size !== null ? page * size : undefined,
    take: size ?? undefined,
  });

  // Výstup
  const result = {
    data: companies,
    count: companies.length,
    total: summary._count || 0,
    page: page ?? null,
    size: size ?? null,
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

  // Normalizace webové adresy
  let website = body.website?.trim();
  if (
    website &&
    !website.startsWith("http://") &&
    !website.startsWith("https://")
  ) {
    website = "https://" + website;
  }

  const company = await prisma.company.create({
    data: {
      name: body.name,
      companyIdentificationNumber: body.companyIdentificationNumber,
      active: body.active,
      description: body.description,
      website,
      created: new Date(),
      creatorId: session.user.id,
      locationId: Number(body.locationId),
    },
  });
  return Response.json(company, { status: 201 });
}
