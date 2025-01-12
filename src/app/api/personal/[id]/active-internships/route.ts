import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;

  // Authenticate user
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // Check if the user is allowed to access the requested data
  const isUnauthorized =
    session.user.role !== Role.ADMIN &&
    session.user.role !== Role.TEACHER &&
    session.user.id !== id;

  if (isUnauthorized) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  try {
    // Fetch active sets and corresponding internships
    const activeInternships = await prisma.set.findMany({
      where: {
        active: true,
        internships: {
          some: {
            userId: id,
          },
        },
      },
      include: {
        internships: {
          where: {
            userId: id,
          },
          include: {
            diaries: true,
            company: { select: { name: true } }, // Include company name
          },
        },
      },
    });

    // Transform data to include required fields and counts only
    const result = activeInternships.map((set) => ({
      id: set.id,
      name: set.name,
      start: set.start,
      end: set.end,
      internships: set.internships.map((internship) => ({
        id: internship.id,
        companyRepName: internship.companyRepName,
        companyMentorName: internship.companyMentorName,
        jobDescription: internship.jobDescription,
        additionalInfo: internship.additionalInfo,
        diaryCount: internship.diaries.length,
        companyName: internship.company?.name || "Unknown", // Include company name
      })),
    }));

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching active internships:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}