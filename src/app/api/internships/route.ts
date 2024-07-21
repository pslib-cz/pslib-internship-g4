import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { InternshipExpandedRecord } from "@/types/entities";
import { type ListResult } from "@/types/data";

export async function GET(request: NextRequest) {
  const session = await auth();
  const searchParams = request.nextUrl.searchParams;
  let userId = searchParams.get("user");
  const givenName = searchParams.get("givenName");
  const surname = searchParams.get("surname");
  const setId = searchParams.get("set");
  const setName = searchParams.get("setName");
  const companyId = searchParams.get("company");
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

  if(session.user.role !== "admin" && session.user.role !== "teacher") {
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

  let internships: InternshipExpandedRecord[] =
    await prisma.internship.findMany({
      select: {
        id: true,
        userId: true,
        companyId: true,
        locationId: true,
        reservationUserId: true,
        classname: true,
        companyRepName: true,
        companyRepEmail: true,
        companyRepPhone: true,
        companyMentorName: true,
        companyMentorEmail: true,
        companyMentorPhone: true,
        jobDescription: true,
        additionalInfo: true,
        appendixText: true,
        created: true,
        user: {
          select: {
            givenName: true,
            surname: true,
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
          },
        },
        reservationUser: {
          select: {
            givenName: true,
            surname: true,
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
  let result: ListResult<InternshipExpandedRecord> = {
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
  let isManager = session.user.role !== "admin" && session.user.role !== "teacher";
  if (
    session.user.role !== "admin" &&
    session.user.role !== "teacher" &&
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
  const internship = await prisma.internship.create({
    data: {
      userId: body.userId,
      companyId: Number(body.companyId),
      locationId: Number(body.locationId),
      reservationUserId: (isManager ? body.reservationUserId : undefined) ?? null,
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
      kind: body.kind,
      highlighted: isManager ? body.highlighted : false,
    },
  });
  return new Response(JSON.stringify(internship), { status: 201 });
}
