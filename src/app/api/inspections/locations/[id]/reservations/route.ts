import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { type ListResult } from "@/types/data";
import { Role } from "@/types/auth";
import { UserWithRole } from "@/types/entities";

type intershipWithReservationUser = {
  id: string;
  classname: string;
  companyId: number;
  companyName: string;
  user: UserWithRole | null;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  const id = Number(params.id);
  const session = await auth();
  const searchParams = request.nextUrl.searchParams;
  const setId: number | null =
    searchParams.get("set") !== null
      ? parseInt(searchParams.get("set") ?? "")
      : null;
  const companyId: number | null =
    searchParams.get("company") !== null
      ? parseInt(searchParams.get("company") ?? "")
      : null;
  const year = searchParams.get("year");
  const inspectorId = searchParams.get("inspector");
  const active = searchParams.get("active");
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

  let location = await prisma.location.findUnique({
    where: {
      id: id,
    },
  });

  if (!location) {
    return new Response("Not found", {
      status: 404,
    });
  }

  if (session.user.role !== Role.ADMIN && session.user.role !== Role.TEACHER) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  let summary = await prisma.internship.aggregate({
    _count: true,
    where: {
      setId: {
        equals: setId ? Number(setId) : undefined,
      },
      companyId: {
        equals: companyId ? Number(companyId) : undefined,
      },
      locationId: {
        equals: id,
      },
      reservationUserId: {
        equals: inspectorId ? inspectorId : undefined,
      },
      set: {
        year: {
          equals: year ? Number(year) : undefined,
        },
        active: {
          equals:
            active === "true" ? true : active === "false" ? false : undefined,
        },
      },
    },
  });

  let internships = await prisma.internship.findMany({
    select: {
      id: true,
      classname: true,
      created: true,
      kind: true,
      highlighted: true,
      reservationUser: {
        select: {
          id: true,
          givenName: true,
          surname: true,
          email: true,
          role: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      setId: {
        equals: setId ? Number(setId) : undefined,
      },
      companyId: {
        equals: companyId ? Number(companyId) : undefined,
      },
      locationId: {
        equals: id,
      },
      reservationUserId: {
        equals: inspectorId ? inspectorId : undefined,
      },
      set: {
        year: {
          equals: year ? Number(year) : undefined,
        },
        active: {
          equals:
            active === "true" ? true : active === "false" ? false : undefined,
        },
      },
    },
    orderBy: [
      {
        created:
          orderBy === "created"
            ? "asc"
            : orderBy === "created_desc"
              ? "desc"
              : undefined,
        classname:
          orderBy === "classname"
            ? "asc"
            : orderBy === "classname_desc"
              ? "desc"
              : undefined,
      },
    ],
    skip: page !== null && size !== null ? page * size : undefined,
    take: size !== null ? size : undefined,
  });
  let result: ListResult<intershipWithReservationUser> = {
    data: internships.map((internship) => ({
      id: internship.id,
      classname: internship.classname,
      companyId: internship.company.id,
      companyName: internship.company.name,
      user: internship.reservationUser,
    })),
    count: internships.length,
    total: summary._count || 0,
    page: page,
    size: size,
  };
  return Response.json(result);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  const session = await auth();
  const id = Number(params.id);
  const searchParams = request.nextUrl.searchParams;
  const setId: number | null =
    searchParams.get("set") !== null
      ? parseInt(searchParams.get("set") ?? "")
      : null;
  const companyId: number | null =
    searchParams.get("company") !== null
      ? parseInt(searchParams.get("company") ?? "")
      : null;
  const year = searchParams.get("year");
  const inspectorId = searchParams.get("inspector");
  const active = searchParams.get("active");
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  let location = await prisma.location.findUnique({
    where: {
      id: id,
    },
  });

  if (!location) {
    return new Response("Not found", {
      status: 404,
    });
  }

  if (session.user.role !== Role.ADMIN && session.user.role !== Role.TEACHER) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  let internships = await prisma.internship.updateMany({
    where: {
      locationId: id,
      reservationUserId: null,
      setId: setId ? Number(setId) : undefined,
      companyId: companyId ? Number(companyId) : undefined,
      set: {
        year: year ? Number(year) : undefined,
        active:
          active === "true" ? true : active === "false" ? false : undefined,
      },
    },
    data: {
      reservationUserId: session.user.id,
    },
  });

  return Response.json(internships, { status: 200 });
}
