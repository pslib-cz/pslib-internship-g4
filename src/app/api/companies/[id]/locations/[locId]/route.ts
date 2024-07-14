import { CompanyBranch } from '@prisma/client'
import { type NextRequest } from 'next/server'
import { auth } from "@/auth";
import prisma from "@/utils/db";

export async function GET(request: NextRequest, {params}: {params: {id: number, locId: number}}) {
    const session = await auth();
    const id = Number(params.id);
    const loc = Number(params.locId);

    let cb: CompanyBranch | null = await prisma.companyBranch.findFirst({
        where: {companyId: id, locationId: loc}
    });
    if(!cb) {
        return new Response("Not found", {
            status: 404,
        })
    }
    return Response.json(cb)
}

export async function DELETE(request: NextRequest, {params}: {params: {id: number, locId: number}}) {
    const session = await auth();
    const id = Number(params.id)
    const loc = Number(params.locId);

    if(!session) {
      return new Response("Unauthorized", {
        status: 401,
      })
    }
    if(session.user.role !== "admin") {
      return new Response("Forbidden", {
        status: 403,
      })
    }
    let cb: CompanyBranch | null = await prisma.companyBranch.findFirst({
        where: {companyId: id, locationId: loc}
    });
    if(!cb) {
        return new Response("Not found", {
            status: 404,
        })
    }
    await prisma.companyBranch.delete({
        where: {companyId_locationId: {companyId: id, locationId: loc}}
    });
    return new Response("Deleted", {
        status: 200,
    })
}

export async function PUT(request: NextRequest, {params}: {params: {id: number, locId: number}}) {
    const session = await auth();
    const id = Number(params.id)
    const loc = Number(params.locId);

    if(!session) {
      return new Response("Unauthorized", {
        status: 401,
      })
    }
    if(session.user.role !== "admin") {
      return new Response("Forbidden", {
        status: 403,
      })
    }
    let cb: CompanyBranch | null = await prisma.companyBranch.findFirst({
        where: {companyId: id, locationId: loc}
    });
    if(!cb) {
        return new Response("Not found", {
            status: 404,
        })
    }

    const body = await request.json()
    await prisma.companyBranch.update({
        where: {companyId_locationId: {companyId: id, locationId: loc}},
        data: body
    });
    return new Response("Updated", {
        status: 200,
    })
}