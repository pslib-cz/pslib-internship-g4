import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";
import { isValidInternshipState, canTransition} from "@/data/lists";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  let internship = await prisma.internship.findFirst({
    where: { id: id },
  });

  if (!internship) {
    return new Response("Internship not found", {
      status: 404,
    });
  }

  if (session.user.role !== Role.ADMIN && session.user.role !== Role.TEACHER && session.user.id !== internship.userId) {
    return new Response("Forbidden", {
      status: 403,
    });
  }
  return Response.json(internship.state);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } },
  ) {
    const session = await auth();
    const id = params.id;
  
    if (!session) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    let internship = await prisma.internship.findFirst({
      where: { id: id },
    });
  
    if (!internship) {
      return new Response("Not found", {
        status: 404,
      });
    }
    if (session.user.role !== Role.ADMIN && session.user.role !== Role.TEACHER && session.user.id !== internship.userId) {
        return new Response("Forbidden", {
          status: 403,
        });
      }
  
    const body = await request.json();
  
    if (!isValidInternshipState(body.state)) {
      return new Response("Invalid state", {
        status: 400,
      });
    }

    if (session.user.role !== Role.ADMIN && !canTransition(internship.state, body.state, (session.user.id === Role.ADMIN || session.user.id === Role.TEACHER))) {
        return new Response("Invalid state transition", {
          status: 400,
        });
    }

    await prisma.internship.update({
      where: { id: id },
      data: {
        state: body.state,
      },
    });
    return new Response(JSON.stringify({ body }), {
      status: 200,
    });
  }