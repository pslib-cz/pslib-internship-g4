import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";
import { type ListResult } from "@/types/data";

type UserListItem = {
  id: string;
  email: string | null;
  image: string | null;
  department: string | null;
  role: string | null;
  surname: string | null;
  givenName: string | null;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const givenName = searchParams.get("givenName");
  const surname = searchParams.get("surname");
  const role = searchParams.get("role");
  const department = searchParams.get("department");
  const email = searchParams.get("email");
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
  if (!(session.user.role in [Role.ADMIN, Role.TEACHER])) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  let roleWhere;
  switch (role) {
    case Role.MANAGER:
      roleWhere = { in: [Role.ADMIN, Role.TEACHER] };
      break;
    case Role.ADMIN:
      roleWhere = { equals: Role.ADMIN };
      break;
    case Role.TEACHER:
      roleWhere = { equals: Role.TEACHER };
      break;
    case Role.STUDENT:
      roleWhere = { equals: Role.STUDENT };
      break;
    case Role.GUEST:
      roleWhere = { equals: Role.GUEST };
      break;
    default:
      roleWhere = {};
  }

  let summary = await prisma.user.aggregate({
    _count: true,
    where: {
      givenName: {
        contains: givenName !== null ? givenName : undefined,
      },
      surname: {
        contains: surname !== null ? surname : undefined,
      },
      email: {
        contains: email !== null ? email : undefined,
      },
      role: roleWhere,
      department: {
        contains: department ? department : undefined,
      },
    },
  });

  let users = await prisma.user.findMany({
    select: {
      id: true,
      name: false,
      email: true,
      emailVerified: false,
      image: true,
      department: true,
      role: true,
      birthDate: false,
      phone: false,
      surname: true,
      givenName: true,
      street: false,
      descNo: false,
      orientNo: false,
      municipality: false,
      postalCode: false,
    },
    where: {
      givenName: {
        contains: givenName !== null ? givenName : undefined,
      },
      surname: {
        contains: surname !== null ? surname : undefined,
      },
      email: {
        contains: email !== null ? email : undefined,
      },
      role: roleWhere,
      department: {
        contains: department ? department : undefined,
      },
    },
    orderBy: [
      {
        givenName:
          orderBy === "givenName"
            ? "asc"
            : orderBy === "givenName_desc"
              ? "desc"
              : undefined,
        surname:
          orderBy === "surname"
            ? "asc"
            : orderBy === "surname_desc"
              ? "desc"
              : undefined,
        email:
          orderBy === "email"
            ? "asc"
            : orderBy === "email_desc"
              ? "desc"
              : undefined,
        department:
          orderBy === "department"
            ? "asc"
            : orderBy === "department_desc"
              ? "desc"
              : undefined,
        role:
          orderBy === "role"
            ? "asc"
            : orderBy === "role_desc"
              ? "desc"
              : undefined,
      },
      {
        givenName:
          orderBy === "surname"
            ? "asc"
            : orderBy === "surname_desc"
              ? "desc"
              : undefined,
        surname:
          orderBy === "givenName"
            ? "asc"
            : orderBy === "givenName_desc"
              ? "desc"
              : undefined,
      },
    ],
    skip: page !== null && size !== null ? page * size : undefined,
    take: size !== null ? size : undefined,
  });
  let result: ListResult<UserListItem> = {
    data: users,
    count: users.length,
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
  if (session.user.role !== Role.ADMIN) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  const user = await prisma.user.create({
    data: {
      name: body.givenName + " " + body.surname,
      givenName: body.givenName,
      surname: body.surname,
      email: body.email,
      role: body.role,
      department: body.department === "" ? null : body.department,
      birthDate: body.birthDate ? new Date(body.birthDate) : null,
      phone: body.phone,
      street: body.street,
      descNo: body.descNo ? parseInt(body.descNo) : null,
      orientNo: body.orientNo,
      municipality: body.municipality,
      postalCode: body.postalCode ? parseInt(body.postalCode) : null,
      emailVerified: null,
    },
  });
  return Response.json(user, { status: 201 });
}
