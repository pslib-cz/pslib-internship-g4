import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { InternshipInspectionList } from "@/types/entities";
import { type ListResult } from "@/types/data";
import { Role } from "@/types/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  const searchParams = request.nextUrl.searchParams;
  let userId = searchParams.get("user");
  const givenName = searchParams.get("givenName");
  const surname = searchParams.get("surname");
  const setId: number | null =
    searchParams.get("set") !== null
      ? parseInt(searchParams.get("set") ?? "")
      : null;
  const setName = searchParams.get("setName");
  const companyId: number | null =
    searchParams.get("company") !== null
      ? parseInt(searchParams.get("company") ?? "")
      : null;
  const companyName = searchParams.get("companyName");
  const locationId = searchParams.get("location");
  const year = searchParams.get("year");
  const inspectorId = searchParams.get("inspector");
  const classname = searchParams.get("class");
  const kind = searchParams.get("kind");
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

  if (
    session.user &&
    session.user.role !== "admin" &&
    session.user.role !== "teacher"
  ) {
    userId = session.user.id;
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
        equals: locationId ? Number(locationId) : undefined,
      },
      reservationUserId: {
        equals: inspectorId ? inspectorId : undefined,
      },
      classname: {
        contains: classname ? classname : undefined,
      },
      kind: {
        equals: kind ? Number(kind) : undefined,
      },
      user: {
        id: {
          equals: userId ? userId : undefined,
        },
        givenName: {
          contains: givenName ? givenName : undefined,
        },
        surname: {
          contains: surname ? surname : undefined,
        },
      },
      set: {
        name: {
          contains: setName ? setName : undefined,
        },
        year: {
          equals: year ? Number(year) : undefined,
        },
        active: {
          equals:
            active === "true" ? true : active === "false" ? false : undefined,
        },
      },
      company: {
        name: {
          contains: companyName ? companyName : undefined,
        },
      },
    },
  });

  let internships: InternshipInspectionList[] =
    await prisma.internship.findMany({
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
        location: {
          select: {
            id: true,
            municipality: true,
            street: true,
            descNo: true,
            orientNo: true,
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
        diaries: {
          select: {
            id: true,
            created: true,
            date: true,
            text: true,
            createdById: true,
            createdBy: {
              select: {
                id: true,
                givenName: true,
                surname: true,
                email: true,
              },
            },
          },
        },
        inspections: {
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
              },
            },
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
          equals: locationId ? Number(locationId) : undefined,
        },
        reservationUserId: {
          equals: inspectorId ? inspectorId : undefined,
        },
        classname: {
          contains: classname ? classname : undefined,
        },
        kind: {
          equals: kind ? Number(kind) : undefined,
        },
        user: {
          id: {
            equals: userId ? userId : undefined,
          },
          givenName: {
            contains: givenName ? givenName : undefined,
          },
          surname: {
            contains: surname ? surname : undefined,
          },
        },
        set: {
          name: {
            contains: setName ? setName : undefined,
          },
          year: {
            equals: year ? Number(year) : undefined,
          },
          active: {
            equals:
              active === "true" ? true : active === "false" ? false : undefined,
          },
        },
        company: {
          name: {
            contains: companyName ? companyName : undefined,
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
  let result: ListResult<InternshipInspectionList> = {
    data: internships,
    count: internships.length,
    total: summary._count || 0,
    page: page,
    size: size,
  };
  return Response.json(result);
}
