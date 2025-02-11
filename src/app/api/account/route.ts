import { type NextRequest } from "next/server";
import { User } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  let user = await prisma.user.findFirst({
    where: { id: session.user?.id },
  });

  return Response.json(user);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();

  // Převod `descNo` na číslo nebo `null`
  if (typeof body.descNo === "string" && body.descNo.trim() === "") {
    body.descNo = null;
  } else if (!isNaN(Number(body.descNo))) {
    body.descNo = Number(body.descNo);
  }

  // Převod `postalCode` na číslo nebo `null`
  if (typeof body.postalCode === "string" && body.postalCode.trim() === "") {
    body.postalCode = null;
  } else if (!isNaN(Number(body.postalCode))) {
    body.postalCode = Number(body.postalCode);
  }

  // Sestavení `name`
  if (body.givenName && body.surname) {
    body.name = `${body.givenName} ${body.surname}`;
  }

  // Převod `birthDate` na ISO formát
  if (body.birthDate) {
    const date = new Date(body.birthDate);
    if (!isNaN(date.getTime())) {
      body.birthDate = date.toISOString();
    } else {
      return new Response("Invalid birthDate format", { status: 400 });
    }
  }

  // Filtrujeme jen platná pole
  const updateData: Partial<User> = {};
  if (body.name) updateData.name = body.name;
  if (body.givenName) updateData.givenName = body.givenName;
  if (body.surname) updateData.surname = body.surname;
  if (body.email) updateData.email = body.email;
  if (body.department) updateData.department = body.department;
  if (body.birthDate) updateData.birthDate = body.birthDate;
  if (body.phone) updateData.phone = body.phone;
  if (body.street) updateData.street = body.street;
  if (body.descNo !== undefined) updateData.descNo = body.descNo;
  if (body.orientNo) updateData.orientNo = body.orientNo;
  if (body.municipality) updateData.municipality = body.municipality;
  if (body.postalCode !== undefined) updateData.postalCode = body.postalCode;

  // Pokus o update
  try {
    const user = await prisma.user.update({
      where: { id: session.user?.id },
      data: updateData,
    });

    return Response.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response("Update failed", { status: 500 });
  }
}
