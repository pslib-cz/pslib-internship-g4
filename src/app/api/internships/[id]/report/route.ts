import { NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  let internship = await prisma.internship.findFirst({
    where: { id: id },
    include: {
      user: true,
      company: true,
      set: true,
      diaries: {
        orderBy: { date: "asc" },
      },
    },
  });

  if (!internship) {
    return new Response("Not found", { status: 404 });
  }

  if (
    session.user.role !== Role.ADMIN &&
    session.user.role !== Role.TEACHER &&
    session.user.id !== internship.userId
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  const reportHtml = `
    <html>
    <head>
      <title>Internship Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          padding: 20px;
          background-color: #f9f9f9;
        }
        h1, h2 {
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        @media print {
          body {
            background-color: white;
          }
          table, th, td {
            border: 1px solid black;
          }
        }
      </style>
    </head>
    <body>
      <h1>Internship Report</h1>
      <p><strong>Student:</strong> ${internship.user.givenName} ${internship.user.surname}</p>
      <p><strong>Company:</strong> ${internship.company.name}</p>
      <p><strong>Internship Set:</strong> ${internship.set.name}</p>
      <h2>Diary Records</h2>
      <table>
        <tr><th>Date</th><th>Entry</th></tr>
        ${internship.diaries
          .map(
            (diary) => `
              <tr>
                <td>${new Date(diary.date).toLocaleDateString()}</td>
                <td>${diary.text}</td>
              </tr>
            `,
          )
          .join("")}
      </table>
      <h2>Final Report</h2>
      <p>${internship.conclusion || "No final report provided."}</p>
    </body>
    </html>
  `;

  return new Response(reportHtml, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
}
