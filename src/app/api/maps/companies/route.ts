import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { LocationForComaniesAndBranches } from "@/types/entities";
import { type ListResult } from "@/types/data";

export async function GET(request: NextRequest) {
  const session = await auth();
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
  const mun = searchParams.get("municipality");
  const taxNum = Number(searchParams.get("taxNum"));
  const act = searchParams.get("active");
  const orderBy = searchParams.get("orderBy");
  const page: number | null =
    searchParams.get("page") !== null
      ? parseInt(searchParams.get("page") ?? "")
      : null;
  const size: number | null =
    searchParams.get("size") !== null
      ? parseInt(searchParams.get("size") ?? "")
      : null;
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
  let summary = await prisma.location.aggregate({
    _count: true,
    where: {
      OR: [
        {
          companies: {
            some: {
              name: {
                contains: name ? name : undefined,
              },
              companyIdentificationNumber: {
                equals: taxNum ? taxNum : undefined,
              },
              active: {
                equals: act ? act === "true" : undefined,
              },
            },
          },
        },
        {
          companyBranches: {
            some: {
              name: {
                contains: name ? name : undefined,
              },
              company: {
                name: {
                  contains: name ? name : undefined,
                },
                companyIdentificationNumber: {
                  equals: taxNum ? taxNum : undefined,
                },
              },
            },
          },
        },
        {
          municipality: {
            contains: mun ? mun : undefined,
          },
        },
      ],
    },
  });

  let locations: LocationForComaniesAndBranches[] =
    await prisma.location.findMany({
      select: {
        id: true,
        municipality: true,
        latitude: true,
        longitude: true,
        companies: {
          select: {
            id: true,
            name: true,
            companyIdentificationNumber: true,
          },
        },
        companyBranches: {
          select: {
            name: true,
            companyId: true,
            company: {
              select: {
                name: true,
                companyIdentificationNumber: true,
              },
            },
          },
        },
      },
      where: {
        OR: [
          {
            companies: {
              some: {
                name: {
                  contains: name ? name : undefined,
                },
                companyIdentificationNumber: {
                  equals: taxNum ? taxNum : undefined,
                },
                active: {
                  equals: act ? act === "true" : undefined,
                },
              },
            },
          },
          {
            companyBranches: {
              some: {
                name: {
                  contains: name ? name : undefined,
                },
                company: {
                  name: {
                    contains: name ? name : undefined,
                  },
                  companyIdentificationNumber: {
                    equals: taxNum ? taxNum : undefined,
                  },
                },
              },
            },
          },
          {
            municipality: {
              contains: mun ? mun : undefined,
            },
          },
        ],
      },
      orderBy: orderBy
        ? {
            [orderBy]: "asc",
          }
        : undefined,
      skip: page !== null && size !== null ? page * size : undefined,
      take: size !== null ? size : undefined,
    });
  let result: ListResult<LocationForComaniesAndBranches> = {
    data: locations,
    count: locations.length,
    total: summary._count || 0,
    page: page,
    size: size,
  };
  return Response.json(result);
}
