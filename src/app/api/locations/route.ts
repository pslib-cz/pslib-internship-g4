import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Prisma } from "@prisma/client";
import { type ListResult } from "@/types/data";
import { Role } from "@/types/auth";

type LocationListItem = {
  id: number;
  country: string | null;
  municipality: string | null;
  street: string | null;
  postalCode: number | null;
  latitude: Prisma.Decimal | null;
  longitude: Prisma.Decimal | null;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const country = searchParams.get("country");
  const municipality = searchParams.get("municipality");
  const street = searchParams.get("street");
  const latWest = Number(searchParams.get("latWest"));
  const latEast = Number(searchParams.get("latEast"));
  const longNorth = Number(searchParams.get("longNorth"));
  const longSouth = Number(searchParams.get("longSouth"));
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

  let summary = await prisma.location.aggregate({
    _count: true,
    where: {
      country: {
        contains: country !== null ? country : undefined,
      },
      municipality: {
        contains: municipality !== null ? municipality : undefined,
      },
      street: {
        contains: street !== null ? street : undefined,
      },
      latitude: {
        gte: latWest !== null ? latWest : undefined,
        lte: latEast !== null ? latEast : undefined,
      },
      longitude: {
        gte: longSouth !== null ? longSouth : undefined,
        lte: longNorth !== null ? longNorth : undefined,
      },
    },
  });

  let locations: LocationListItem[] = await prisma.location.findMany({
    select: {
      id: true,
      country: true,
      municipality: true,
      street: true,
      postalCode: true,
      latitude: true,
      longitude: true,
    },
    where: {
      country: {
        contains: country !== null ? country : undefined,
      },
      municipality: {
        contains: municipality !== null ? municipality : undefined,
      },
      street: {
        contains: street !== null ? street : undefined,
      },
      latitude: {
        gte: latWest !== null ? latWest : undefined,
        lte: latEast !== null ? latEast : undefined,
      },
      longitude: {
        gte: longSouth !== null ? longSouth : undefined,
        lte: longNorth !== null ? longNorth : undefined,
      },
    },
    orderBy: {
      [orderBy || "id"]: "asc",
    },
    skip: page !== null && size !== null ? page * size : undefined,
    take: size !== null ? size : undefined,
  });
  let result: ListResult<LocationListItem> = {
    data: locations,
    count: locations.length,
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

  const location = await prisma.location.create({
    data: {
      country: body.country === "" ? undefined : body.country,
      municipality: body.municipality === "" ? undefined : body.municipality,
      postalCode: body.postalCode === "" ? undefined : Number(body.postalCode),
      street: body.street === "" ? undefined : body.street,
      latitude: body.latitude === "" ? undefined : Number(body.latitude),
      longitude: body.longitude === "" ? undefined : Number(body.longitude),
      descNo: body.descNo === "" ? undefined : Number(body.descNo),
      orientNo: body.orientNo === "" ? undefined : String(body.orientNo),
      created: new Date(),
    },
  });
  return Response.json(location, { status: 201 });
}
