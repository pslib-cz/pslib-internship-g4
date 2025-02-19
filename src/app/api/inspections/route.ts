import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { InspectionWithInspectorAndInternship } from "@/types/entities";
import { type ListResult } from "@/types/data";
import { Role } from "@/types/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const internship = searchParams.get("internship");
  const result = searchParams.get("result");
  const kind = searchParams.get("kind");
  const inspectorGivenName = searchParams.get("inspectorGivenName");
  const inspectorSurname = searchParams.get("inspectorSurname");
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

  if (
    session.user?.role !== Role.ADMIN &&
    session.user?.role !== Role.TEACHER
  ) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  let summary = await prisma.inspection.aggregate({
    _count: true,
    where: {
      internshipId: {
        equals: internship || undefined,
      },
      result: result ? Number(result) : undefined,
      kind: kind ? Number(kind) : undefined,
      inspectionUser: {
        givenName: {
          contains: inspectorGivenName || undefined,
        },
        surname: {
          contains: inspectorSurname || undefined,
        },
      },
    },
  });

  const order: any[] = [];
  if (orderBy === "date") order.push({ date: "asc" });
  if (orderBy === "date_desc") order.push({ date: "desc" });
  if (orderBy === "classname") order.push({ classname: "asc" });
  if (orderBy === "classname_desc") order.push({ classname: "desc" });
  if (orderBy === "givenName")
    order.push({ internship: { user: { givenName: "asc" } } });
  if (orderBy === "givenName_desc")
    order.push({ internship: { user: { givenName: "desc" } } });
  if (orderBy === "surname")
    order.push({ internship: { user: { surname: "asc" } } });
  if (orderBy === "surname_desc")
    order.push({ internship: { user: { surname: "desc" } } });

  let inspections: InspectionWithInspectorAndInternship[] =
    await prisma.inspection.findMany({
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
      where: {
        internshipId: {
          equals: internship || undefined,
        },
        result: result ? Number(result) : undefined,
        kind: kind ? Number(kind) : undefined,
        inspectionUser: {
          givenName: {
            contains: inspectorGivenName || undefined,
          },
          surname: {
            contains: inspectorSurname || undefined,
          },
        },
      },
      orderBy: order,
      skip: page !== null && size !== null ? page * size : undefined,
      take: size !== null ? size : undefined,
    });

  let resultData: ListResult<InspectionWithInspectorAndInternship> = {
    data: inspections,
    count: inspections.length,
    total: summary._count ?? 0,
    page: page,
    size: size,
  };
  return Response.json(resultData);
}

export async function POST(request: NextRequest) {
  const session = await auth();

  // Ověření oprávnění
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { internshipId, date, result, kind, note, inspectionUserId } = body;

    // Validace vstupních dat
    if (!internshipId || !date || !result || !kind || !inspectionUserId) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Ověření, zda praxe existuje
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
    });

    if (!internship) {
      return new Response("Internship not found", { status: 404 });
    }

    // Ověření, zda kontrolér existuje
    const inspector = await prisma.user.findUnique({
      where: { id: inspectionUserId },
    });

    if (!inspector) {
      return new Response("Inspector not found", { status: 404 });
    }

    // Omezení pro učitele – může přidat kontrolu jen ke svým praxím
    if (session.user.role === Role.TEACHER) {
      const teacherHasInternship = await prisma.internship.findFirst({
        where: {
          id: internshipId,
          reservationUserId: session.user.id, // Ujistíme se, že učitel je přiřazený k této praxi
        },
      });

      if (!teacherHasInternship) {
        return new Response(
          "Forbidden: You can only add inspections to your own internships",
          {
            status: 403,
          },
        );
      }
    }

    // Vytvoření nové kontroly
    const newInspection = await prisma.inspection.create({
      data: {
        internshipId,
        date: new Date(date),
        result: Number(result),
        kind: Number(kind),
        note,
        inspectionUserId,
      },
    });

    return new Response(JSON.stringify(newInspection), { status: 201 });
  } catch (error) {
    console.error("Error creating inspection:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
