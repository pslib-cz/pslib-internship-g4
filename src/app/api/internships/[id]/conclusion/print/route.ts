import { NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  const internshipId = params.id;

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const internship = await prisma.internship.findUnique({
    where: { id: internshipId },
    select: {
      id: true,
      conclusion: true,
      set: {
        select: {
          start: true,
          end: true,
        },
      },
      classname: true,
      userId: true,
      user: {
        select: {
          givenName: true,
          surname: true,
        },
      },
      company: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!internship) {
    return new Response("Internship not found", { status: 404 });
  }

  const isOwner = session.user.id === internship.userId;
  const isPrivileged =
    session.user.role === Role.ADMIN || session.user.role === Role.TEACHER;

  if (!isOwner && !isPrivileged) {
    return new Response("Forbidden", { status: 403 });
  }

  const html = `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8" />
  <title>Praxe – závěrečná zpráva</title>
  <style>
    body { font-family: sans-serif; margin: 3rem; }
    h1 { font-size: 1.6rem; margin-bottom: 1rem; }
    .info { margin-bottom: 1.5rem; }
    .info p { margin: 0.25rem 0; }
    .conclusion { white-space: pre-wrap; border-top: 1px solid #ccc; padding-top: 1rem; }
    @media print {
      body { margin: 1cm; }
    }
  </style>
</head>
<body>
  <h1>Závěrečná zpráva z odborné praxe</h1>
  <div class="info">
    <p><strong>Student:</strong> ${internship.user.givenName} ${internship.user.surname}</p>
    <p><strong>Třída:</strong> ${internship.classname}</p>
    <p><strong>Firma:</strong> ${internship.company?.name ?? "neuvedeno"}</p>
    <p><strong>Období:</strong> ${formatDate(internship.set.start)} – ${formatDate(internship.set.end)}</p>
  </div>
  <div class="conclusion">
    ${internship.conclusion ? internship.conclusion : "<em>Bez závěrečné zprávy.</em>"}
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

function formatDate(date: Date | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("cs-CZ").format(new Date(date));
}
