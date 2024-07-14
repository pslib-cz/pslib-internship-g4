import { Prisma, PrismaClient, CompanyBranch, Company } from '@prisma/client'
import { type NextRequest } from 'next/server'
import { auth } from "@/auth";
import prisma from "@/utils/db";

//const prisma = new PrismaClient()

export type CompanyBranchWithLocation = Prisma.CompanyBranchGetPayload<{
  include: { location: true }
}>

export async function GET(request: NextRequest, {params}: {params: {id: number}}) {
    const session = await auth();
    const id = Number(params.id)
/*
    if(!session) {
      return new Response("Unauthorized", {
        status: 401,
      })
    }
    */
    /*
    if(session.user.role !== "admin") {
      return new Response("Forbidden", {
        status: 403,
      })
    }
*/ 
let company: Company | null = await prisma.company.findFirst({
  where: {id: id}
});
  if(!company) {
      return new Response("Not found", {
        status: 404,
      })
  }

  let branches: CompanyBranch[] | null = await prisma.companyBranch.findMany({
      where: {companyId: id},
      include: {
          location: true,
      }
  });

  return Response.json(branches)
}

export async function POST(request: NextRequest, {params}: {params: {id: number}}) {
    const session = await auth();
    const id = Number(params.id)

    if(!session) {
      return new Response("Unauthorized", {
        status: 401,
      })
    }
    /*
    if(session.user.role !== "admin") {
      return new Response("Forbidden", {
        status: 403,
      })
    }
    */
    let company: Company | null = await prisma.company.findFirst({
      where: {id: id}
    });
    if(!company) {
        return new Response("Not found", {
          status: 404,
        })
    }
    let data = await request.json()
    let branch = await prisma.companyBranch.create({
        data: {
            name: data.name,
            locationId: data.locationId,
            companyId: id,
            created: new Date(),
            creatorId: session.user.id
        }
    })
    return Response.json(branch)
}