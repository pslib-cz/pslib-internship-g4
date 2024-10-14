import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { LocationWithInternships } from "@/types/entities";
import { type ListResult } from "@/types/data";
import { Role } from "@/types/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  const searchParams = request.nextUrl.searchParams;
  const active: boolean | null =
    searchParams.get("active") !== null
      ? searchParams.get("active") === "true"
      : null;
  const set: number | null =
    searchParams.get("set") !== null
      ? parseInt(searchParams.get("set") ?? "")
      : null;
  const orderBy = searchParams.get("orderBy");
  const page: number | null =
    searchParams.get("page") !== null
      ? parseInt(searchParams.get("page") ?? "")
      : null;
  const size: number | null =
    searchParams.get("size") !== null
      ? parseInt(searchParams.get("size") ?? "")
      : null;
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  if (session.user.role !== Role.ADMIN && session.user.role !== Role.TEACHER) {
    return new Response("Forbidden", {
      status: 403,
    });
  }
  let summary = await prisma.location.aggregate({
    _count: true,
    where: {
      internships: {
        some: {
          set: {
            active: active !== null ? active : undefined,
            id: set !== null ? set : undefined,
          },
        },
      },
    },
  });

  let locations: LocationWithInternships[] = await prisma.location.findMany({
    select: {
      id: true,
      municipality: true,
      latitude: true,
      longitude: true,
      internships: {
        select: {
          id: true,
          classname: true,
          created: true,
          kind: true,
          highlighted: true,
          state: true,
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
          set: {
            select: {
              id: true,
              name: true,
              year: true,
              editable: true,
              active: true,
              daysTotal: true,
              hoursDaily: true,
              start: true,
              end: true,
              continuous: true,
            },
          },
          reservationUser: {
            select: {
              id: true,
              givenName: true,
              surname: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
    where: {
      internships: {
        some: {
          set: {
            active: active !== null ? active : undefined,
            id: set !== null ? set : undefined,
          },
        },
      },
    },
    orderBy: orderBy
      ? {
          [orderBy]: "asc",
        }
      : undefined,
    skip: page !== null && size !== null ? page * size : undefined,
    take: size !== null ? size : undefined,
  });
  let result: ListResult<LocationWithInternships> = {
    data: locations,
    count: locations.length,
    total: summary._count || 0,
    page: page,
    size: size,
  };
  return Response.json(result);
}
