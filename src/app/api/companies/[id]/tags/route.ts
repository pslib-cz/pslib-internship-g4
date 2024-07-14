import { Prisma, PrismaClient, CompanyTag, Tag, Company } from '@prisma/client'
import { type NextRequest } from 'next/server'
import { auth } from "@/auth";
import prisma from "@/utils/db";

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

  let tags: Tag[] | null = await prisma.tag.findMany({
      include: {
          assignedTags: true,
      }, 
      where: {
        assignedTags: {
            some: {
                companyId: id
            }
        }
      }
  });

  return Response.json(tags)
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
        return new Response("Company not found", {
          status: 404,
        })
    }
    let data = await request.json()
    let tag: Tag | null = await prisma.tag.findFirst({
        where: {
            id: data.id
        }
    });
    if(!tag) {
        return new Response("Tag not found", {
          status: 404,
        })
    }
    let companyTag = await prisma.companyTag.create({
        data: {
            companyId: id,
            tagId: data.id,
            created: new Date(),
            creatorId: session.user.id,
        }
    })
    return Response.json(companyTag)
}