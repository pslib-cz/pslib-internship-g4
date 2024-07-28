import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { InternshipWithCompanyLocationSetUser } from "@/types/entities";
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

  if (session.user.role !== "admin" && session.user.role !== "teacher") {
    userId = session.user.id;
  }

  let summary = await prisma.internship.aggregate({
    _count: true,
    where: {
      setId: {
        equals: setId ? Number(setId) : undefined,
      },
      userId: {
        equals: userId ? userId : undefined,
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
      user: {
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
      },
      company: {
        name: {
          contains: companyName ? companyName : undefined,
        },
      },
    },
  });

  let internships: InternshipWithCompanyLocationSetUser[] =
    await prisma.internship.findMany({
      select: {
        id: true,
        classname: true,
        created: true,
        kind: true,
        userId: true,
        companyId: true,
        setId: true,
        locationId: true,
        user: {
          select: {
            givenName: true,
            surname: true,
            email: true,
          },
        },
        company: {
          select: {
            name: true,
            companyIdentificationNumber: true,
          },
        },
        location: {
          select: {
            municipality: true,
          },
        },
        set: {
          select: {
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
      },
      where: {
        setId: {
          equals: setId ? Number(setId) : undefined,
        },
        userId: {
          equals: userId ? userId : undefined,
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
        user: {
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
  let result: ListResult<InternshipWithCompanyLocationSetUser> = {
    data: internships,
    count: internships.length,
    total: summary._count || 0,
    page: page,
    size: size,
  };
  return Response.json(result);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const body = await request.json();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  let isManager =
    session.user.role !== Role.ADMIN && session.user.role !== Role.TEACHER;
  if (
    session.user.role !== Role.ADMIN &&
    session.user.role !== Role.TEACHER &&
    session.user.id !== body.userId
  ) {
    return new Response("Forbidden", {
      status: 403,
    });
  }
  if (body.companyMentorName.trim() === "") {
    body.companyMentorName = body.companyRepName;
    body.companyMentorEmail = body.companyRepEmail;
    body.companyMentorPhone = body.companyRepPhone;
  }
  const company = await prisma.company.findFirst({
    where: { id: Number(body.companyId) },
  });
  if (!company) {
    return new Response("Company not found", {
      status: 404,
    });
  }
  console.log(company);
  const internship = await prisma.internship.create({
    data: {
      userId: body.userId ?? session.user.id,
      companyId: Number(body.companyId),
      locationId:
        body.locationId === undefined
          ? company.locationId
          : Number(body.locationId),
      reservationUserId:
        (isManager ? body.reservationUserId : undefined) ?? null,
      classname: body.classname,
      setId: Number(body.setId),
      companyRepName: body.companyRepName,
      companyRepEmail: body.companyRepEmail ?? "",
      companyRepPhone: body.companyRepPhone ?? "",
      companyMentorName: body.companyMentorName.trim(),
      companyMentorEmail: body.companyMentorEmail.trim(),
      companyMentorPhone: body.companyMentorPhone.trim(),
      jobDescription: body.jobDescription,
      additionalInfo: body.additionalInfo,
      appendixText: body.appendixText,
      created: new Date(),
      creatorId: session.user.id,
      updated: new Date(),
      kind: Number(body.kind),
      highlighted: isManager ? body.highlighted : false,
    },
  });
  return new Response(JSON.stringify(internship), { status: 201 });
}
