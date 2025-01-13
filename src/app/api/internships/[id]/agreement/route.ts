import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";
import { InternshipFullRecord } from "@/types/entities";

// Pomocná funkce pro formátování adres
function formatAddress(
  street?: string | null,
  descNo?: number | string | null,
  orientNo?: string | null,
  postalCode?: number | string | null,
  municipality?: string | null,
): string {
  const addressParts = [
    street || "",
    descNo || "",
    orientNo ? `/${orientNo}` : "",
    postalCode || "",
    municipality || "",
  ];
  return addressParts.filter(Boolean).join(", ");
}

// Pomocná funkce pro nahrazení placeholderů
function replacePlaceholders(
  content: string,
  placeholders: Record<string, number | string | null | undefined>,
): string {
  Object.entries(placeholders).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    content = content.replace(regex, String(value ?? ""));
  });
  return content;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const internship = await prisma.internship.findFirst({
    include: {
      set: true,
      user: true,
      company: { include: { location: true } },
      location: true,
      reservationUser: true,
    },
    where: { id },
  });

  if (!internship) {
    return new Response("Internship not found", { status: 404 });
  }

  if (
    session.user.role !== Role.ADMIN &&
    session.user.role !== Role.TEACHER &&
    session.user.id !== internship.userId
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  const template = await prisma.template.findFirst({
    where: { id: internship.set.templateId },
  });
  if (!template) {
    return new Response("Template not found", { status: 404 });
  }

  let content = template.content;

  // Všechny hodnoty pro nahrazení placeholderů
  const placeholders = {
    "Student.GivenName": internship.user.givenName,
    "Student.Surname": internship.user.surname,
    "Student.Name": `${internship.user.givenName} ${internship.user.surname}`,
    "Student.Email": internship.user.email,
    "Student.Classname": internship.classname,
    "Student.BirthDate": internship.user.birthDate?.toString(),
    "Student.Municipality": internship.user.municipality,
    "Student.Street": internship.user.street,
    "Student.DescNumber": internship.user.descNo,
    "Student.OrientNumber": internship.user.orientNo,
    "Student.Zip": internship.user.postalCode,
    "Student.Address": formatAddress(
      internship.user.street,
      internship.user.descNo,
      internship.user.orientNo,
      internship.user.postalCode,
      internship.user.municipality,
    ),
    "Student.Phone": internship.user.phone,
    "Set.Start": new Date(internship.set.start).toLocaleDateString(),
    "Set.End": new Date(internship.set.end).toLocaleDateString(),
    "Set.DaysTotal": internship.set.daysTotal?.toString(),
    "Set.HoursDaily": internship.set.hoursDaily?.toString(),
    "Set.Continuous": internship.set.continuous ? "průběžná" : "souvislá",
    "Set.Year": internship.set.year?.toString(),
    "Company.Name": internship.company.name,
    "Company.CompanyIdentificationNumber":
      internship.company.companyIdentificationNumber?.toString() ?? "není",
    "Internship.Kind": internship.kind?.toString(),
    "Company.RepresentativeName": internship.companyRepName,
    "Company.RepresentativeEmail": internship.companyRepEmail,
    "Company.RepresentativePhone": internship.companyRepPhone,
    "Company.MentorName": internship.companyMentorName,
    "Company.MentorEmail": internship.companyMentorEmail,
    "Company.MentorPhone": internship.companyMentorPhone,
    "Company.Municipality": internship.company.location.municipality,
    "Company.Street": internship.company.location.street,
    "Company.DescNumber": internship.company.location.descNo,
    "Company.OrientNumber": internship.company.location.orientNo,
    "Company.Zip": internship.company.location.postalCode,
    "Company.Country": internship.company.location.country,
    "Company.Address": formatAddress(
      internship.company.location.street,
      internship.company.location.descNo,
      internship.company.location.orientNo,
      internship.company.location.postalCode,
      internship.company.location.municipality,
    ),
    "Location.Municipality": internship.location.municipality,
    "Location.Street": internship.location.street,
    "Location.DescNumber": internship.location.descNo,
    "Location.OrientNumber": internship.location.orientNo,
    "Location.Zip": internship.location.postalCode,
    "Location.Country": internship.location.country,
    "Location.Address": formatAddress(
      internship.location.street,
      internship.location.descNo,
      internship.location.orientNo,
      internship.location.postalCode,
      internship.location.municipality,
    ),
    Description: internship.jobDescription,
    Info: internship.additionalInfo,
    Appendix: internship.appendixText,
    Date: new Date().toLocaleDateString(),
    "School.RepresentativeName": internship.set.representativeName,
    "School.RepresentativeEmail": internship.set.representativeEmail,
    "School.RepresentativePhone": internship.set.representativePhone,
    "School.Name": internship.set.schoolName,
    "School.Logo": internship.set.logoName,
  };

  content = replacePlaceholders(content, placeholders);

  return new Response(content, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}
