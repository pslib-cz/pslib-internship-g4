import { Internship, Location } from "@prisma/client";
import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: number } },
  ) {
    const id = Number(params.id);
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
  
    let internship: Internship | null = await prisma.internship.findFirst({
        where: { id: id },
      });
    
    if (!internship) {
      return new Response("Internship not found", {
        status: 404,
      });
    }
    if (
      session.user.role !== Role.ADMIN &&
      session.user.role !== Role.TEACHER &&
      session.user.id !== internship?.userId
    ) {
      return new Response("Forbidden", {
        status: 403,
      });
    }
    let location: Location | null = await prisma.location.findFirst({
        where: { id: internship.locationId }
      }); 

    if (!location) {
        return new Response("Location not found", {
            status: 404,
        });
    }
    return Response.json(location);
  }

  export async function PATCH(request: NextRequest, { params }: { params: { id: number } },) {
    const session = await auth();
    const id = Number(params.id);
    const body = await request.json();
    if (!session) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
    let internship: Internship | null = await prisma.internship.findFirst({
        where: { id: id },
      });

    if (!internship) {
        return new Response("Internship not found", {
            status: 404,
        });
        }
    let locationId = body.locationId;
    if (!locationId) {
        return new Response("LocationId not specified", {
            status: 400,
        });
    }
    locationId = Number(locationId);
    let location = await prisma.location.findFirst({
        where: { id: locationId }
    });
    if (!location) {
        return new Response("Location not found", {
            status: 404,
        });
    }
    internship = await prisma.internship.update({
        where: { id: id },
        data: { locationId: locationId }
    });
    return new Response(JSON.stringify(internship), { status: 201 });
  }