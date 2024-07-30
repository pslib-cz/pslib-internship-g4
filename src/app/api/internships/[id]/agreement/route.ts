import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";
import { InternshipFullRecord } from "@/types/entities";

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

  let internship: InternshipFullRecord | null =
    await prisma.internship.findFirst({
      include: {
        set: true,
        user: true,
        company: {
          include: { location: true },
        },
        location: true,
        reservationUser: true,
      },
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

  let template = await prisma.template.findFirst({
    where: { id: internship.set.templateId },
  });

  if (!template) {
    return new Response("Template not found", {
      status: 404,
    });
  }

  let content = template.content;
  content = content.replace(
    /{{Student.GivenName}}/g,
    `${internship.user.givenName}`,
  );
  content = content.replace(
    /{{Student.Surname}}/g,
    `${internship.user.surname}`,
  );
  content = content.replace(
    /{{Student.Name}}/g,
    `${internship.user.givenName} ${internship.user.surname}`,
  );
  content = content.replace(
    /{{Student.Email}}/g,
    `${internship.user.email ?? "?"}`,
  );
  content = content.replace(
    /{{Student.Classname}}/g,
    `${internship.classname ?? "?"}`,
  );
  content = content.replace(
    /{{Student.BirthDate}}/g,
    `${internship.user.birthDate ?? "?"}`,
  );
  content = content.replace(
    /{{Student.Municipality}}/g,
    `${internship.user.municipality ?? "?"}`,
  );
  content = content.replace(
    /{{Student.Street}}/g,
    `${internship.user.street ?? "?"}`,
  );
  content = content.replace(
    /{{Student.DescNumber}}/g,
    `${internship.user.descNo ?? "?"}`,
  );
  content = content.replace(
    /{{Student.OrientNumber}}/g,
    `${internship.user.orientNo ?? "?"}`,
  );
  content = content.replace(
    /{{Student.Zip}}/g,
    `${internship.user.postalCode ?? "?"}`,
  );
  content = content.replace(
    /{{Student.Phone}}/g,
    `${internship.user.phone ?? "?"}`,
  );
  content = content.replace(/{{Set.Start}}/g, `${internship.set.start}`);
  content = content.replace(/{{Set.End}}/g, `${internship.set.end}`);
  content = content.replace(
    /{{Set.DaysTotal}}/g,
    `${internship.set.daysTotal}`,
  );
  content = content.replace(
    /{{Set.HoursDaily}}/g,
    `${internship.set.hoursDaily}`,
  );
  content = content.replace(
    /{{Set.Continuous}}/g,
    `${internship.set.continuous ? "Průběžná" : "Souvislá"}`,
  );
  content = content.replace(/{{Set.Year}}/g, `${internship.set.year}`);
  content = content.replace(/{{Company.Name}}/g, `${internship.company.name}`);
  content = content.replace(
    /{{Company.CompanyIdentificationNumber}}/g,
    `${internship.company.companyIdentificationNumber ?? "není"}`,
  );
  content = content.replace(/{{Internship.Kind}}/g, `${internship.kind}`);
  content = content.replace(
    /{{Location.Municipality}}/g,
    `${internship.location.municipality}`,
  );
  content = content.replace(
    /{{Location.Street}}/g,
    `${internship.location.street}`,
  );
  content = content.replace(
    /{{Location.DescNumber}}/g,
    `${internship.location.descNo}`,
  );
  content = content.replace(
    /{{Location.OrientNumber}}/g,
    `${internship.location.orientNo}`,
  );
  content = content.replace(
    /{{Location.Zip}}/g,
    `${internship.location.postalCode}`,
  );
  content = content.replace(
    /{{Location.Country}}/g,
    `${internship.location.country}`,
  );
  content = content.replace(
    /{{Company.RepresentativeName}}/g,
    `${internship.companyRepName ?? "?"}`,
  );
  content = content.replace(
    /{{Company.RepresentativeEmail}}/g,
    `${internship.companyRepEmail ?? "?"}`,
  );
  content = content.replace(
    /{{Company.RepresentativePhone}}/g,
    `${internship.companyRepPhone ?? "?"}`,
  );
  content = content.replace(
    /{{Company.MentorName}}/g,
    `${internship.companyMentorName ?? "?"}`,
  );
  content = content.replace(
    /{{Company.MentorEmail}}/g,
    `${internship.companyMentorEmail ?? "?"}`,
  );
  content = content.replace(
    /{{Company.MentorPhone}}/g,
    `${internship.companyMentorPhone ?? "?"}`,
  );
  content = content.replace(
    /{{Company.Municipality}}/g,
    `${internship.company.location.municipality}`,
  );
  content = content.replace(
    /{{Company.Street}}/g,
    `${internship.company.location.street}`,
  );
  content = content.replace(
    /{{Company.DescNumber}}/g,
    `${internship.company.location.descNo}`,
  );
  content = content.replace(
    /{{Company.OrientNumber}}/g,
    `${internship.company.location.orientNo}`,
  );
  content = content.replace(
    /{{Company.Zip}}/g,
    `${internship.company.location.postalCode}`,
  );
  content = content.replace(
    /{{Company.Country}}/g,
    `${internship.company.location.country}`,
  );
  content = content.replace(/{{Description}}/g, `${internship.jobDescription}`);
  content = content.replace(/{{Info}}/g, `${internship.additionalInfo}`);
  content = content.replace(/{{Appendix}}/g, `${internship.appendixText}`);
  content = content.replace(/{{Date}}/g, `${new Date().toLocaleDateString()}`);
  content = content.replace(
    /{{School.RepresentativeName}}/g,
    `${internship.set.representativeName}`,
  );
  content = content.replace(
    /{{School.RepresentativeEmail}}/g,
    `${internship.set.representativeEmail}`,
  );
  content = content.replace(
    /{{School.RepresentativePhone}}/g,
    `${internship.set.representativePhone}`,
  );
  content = content.replace(/{{School.Name}}/g, `${internship.set.schoolName}`);
  content = content.replace(/{{School.Logo}}/g, `${internship.set.logoName}`);

  let res = new Response(content, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
  return res;
}
