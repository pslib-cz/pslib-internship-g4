import type {NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/utils/db";
import { Role } from "@/types/auth";
import {
  InternshipFullRecord,
} from "@/types/entities";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: number } },
  ) {
    const id = Number(params.id);
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
  
      let internship: InternshipFullRecord | null = await prisma.internship.findFirst({
        include: {
          set: true,
          user: true,
          company: true,
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
    content = content.replace(/{{Student.GivenName}}/g, `${internship.user.givenName}`);
    content = content.replace(/{{Student.Surname}}/g, `${internship.user.surname}`);
    content = content.replace(/{{Student.Email}}/g, `${internship.user.email}`);
    content = content.replace(/{{Student.Classmame}}/g, `${internship.classname}`);
    content = content.replace(/{{Student.BirthDate}}/g, `${internship.user.birthDate}`);
    content = content.replace(/{{setStart}}/g, `${internship.set.start}`);
    content = content.replace(/{{setEnd}}/g, `${internship.set.end}`);
    content = content.replace(/{{setDaysTotal}}/g, `${internship.set.daysTotal}`);
    content = content.replace(/{{setHoursDaily}}/g, `${internship.set.hoursDaily}`);
    content = content.replace(/{{setContinuous}}/g, `${internship.set.continuous ? "Průběžná" : "Souvislá"}`);
    content = content.replace(/{{setYear}}/g, `${internship.set.year}`);
    content = content.replace(/{{companyName}}/g, `${internship.company.name}`);
    content = content.replace(/{{companyCompanyIdentificationNumber}}/g, `${internship.company.companyIdentificationNumber ?? "není"}`);
    content = content.replace(/{{internshipKind}}/g, `${internship.kind}`);
    content = content.replace(/{{locationMunicipality}}/g, `${internship.location.municipality}`);
    content = content.replace(/{{locationStreet}}/g, `${internship.location.street}`);
    content = content.replace(/{{locationDescNumber}}/g, `${internship.location.descNo}`);
    content = content.replace(/{{locationOrientNumber}}/g, `${internship.location.orientNo}`);
    content = content.replace(/{{locationZip}}/g, `${internship.location.postalCode}`);
    content = content.replace(/{{locationCountry}}/g, `${internship.location.country}`);
    content = content.replace(/{{companyRepresentativeName}}/g, `${internship.companyRepName}`);
    content = content.replace(/{{companyRepresentativeEmail}}/g, `${internship.companyRepEmail}`);
    content = content.replace(/{{companyRepresentativePhone}}/g, `${internship.companyRepPhone}`);
    content = content.replace(/{{companyMentorName}}/g, `${internship.companyMentorName}`);
    content = content.replace(/{{companyMentorEmail}}/g, `${internship.companyMentorEmail}`);
    content = content.replace(/{{companyMentorPhone}}/g, `${internship.companyMentorPhone}`);
    content = content.replace(/{{description}}/g, `${internship.jobDescription}`);
    content = content.replace(/{{info}}/g, `${internship.additionalInfo}`);
    content = content.replace(/{{appendix}}/g, `${internship.appendixText}`);
    content = content.replace(/{{date}}/g, `${new Date().toLocaleDateString()}`);
    content = content.replace(/{{schoolRepresentativeName}}/g, `${internship.set.representativeName}`);
    content = content.replace(/{{schoolRepresentativeEmail}}/g, `${internship.set.representativeEmail}`);
    content = content.replace(/{{schoolRepresentativePhone}}/g, `${internship.set.representativePhone}`);

    let res = new Response(content, { status: 200, headers: { "Content-Type": "text/html" } });
    return res;
  }