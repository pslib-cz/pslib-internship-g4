import { Prisma } from "@prisma/client";

export type UserWithRole = Prisma.UserGetPayload<{
  select: {
    id: true;
    givenName: true;
    surname: true;
    email: true;
    role: true;
  };
}>;

export type CompanyWithLocation = Prisma.CompanyGetPayload<{
  include: { location: true };
}>;

export type CompanyWithLocationAndCreator = Prisma.CompanyGetPayload<{
  select: {
    id: true;
    name: true;
    companyIdentificationNumber: true;
    description: true;
    website: true;
    active: true;
    created: true;
    creator: {
      select: {
        id: true;
        givenName: true;
        surname: true;
        email: true;
      };
    };
    location: {
      select: {
        id: true;
        street: true;
        municipality: true;
        country: true;
        postalCode: true;
        descNo: true;
        orientNo: true;
        latitude: true;
        longitude: true;
      };
    };
  };
}>;

export type CompanyBranchWithLocation = Prisma.CompanyBranchGetPayload<{
  include: { location: true };
}>;

export type InternshipWithCompanyLocationSetUser = Prisma.InternshipGetPayload<{
  select: {
    id: true;
    classname: true;
    created: true;
    kind: true;
    userId: true;
    companyId: true;
    setId: true;
    locationId: true;
    jobDescription: true;
    additionalInfo: true;
    appendixText: true;
    user: {
      select: {
        givenName: true;
        surname: true;
        email: true;
      };
    };
    company: {
      select: {
        name: true;
        companyIdentificationNumber: true;
        locationId: true;
      };
    };
    location: {
      select: {
        municipality: true;
      };
    };
    set: {
      select: {
        name: true;
        year: true;
        editable: true;
        active: true;
        daysTotal: true;
        hoursDaily: true;
        start: true;
        end: true;
        continuous: true;
      };
    };
  };
}>;

export type InternshipFullRecord = Prisma.InternshipGetPayload<{
  include: {
    set: true;
    user: true;
    company: {
      include: { location: true };
    };
    location: true;
    reservationUser: true;
  };
}>;

export type LocationForComaniesAndBranches = Prisma.LocationGetPayload<{
  select: {
    id: true;
    municipality: true;
    latitude: true;
    longitude: true;
    companies: {
      select: {
        id: true;
        name: true;
        companyIdentificationNumber: true;
      };
    };
    companyBranches: {
      select: {
        companyId: true;
        name: true;
        company: {
          select: {
            name: true;
            companyIdentificationNumber: true;
          };
        };
      };
    };
  };
}>;

export type TextWithAuthor = Prisma.TextGetPayload<{
  select: {
    id: true;
    title: true;
    content: true;
    created: true;
    published: true;
    updated: true;
    shortable: true;
    priority: true;
    creator: {
      select: {
        id: true;
        givenName: true;
        surname: true;
      };
    };
  };
}>;

export type InternshipInspectionList = Prisma.InternshipGetPayload<{
  select: {
    id: true;
    classname: true;
    created: true;
    kind: true;
    highlighted: true;
    user: {
      select: {
        id: true;
        givenName: true;
        surname: true;
        email: true;
        image: true;
      };
    };
    company: {
      select: {
        id: true;
        name: true;
        companyIdentificationNumber: true;
        locationId: true;
      };
    };
    location: {
      select: {
        id: true;
        municipality: true;
        street: true;
        descNo: true;
        orientNo: true;
      };
    };
    set: {
      select: {
        id: true;
        name: true;
        year: true;
        editable: true;
        active: true;
        daysTotal: true;
        hoursDaily: true;
        start: true;
        end: true;
        continuous: true;
      };
    };
    reservationUser: {
      select: {
        id: true;
        givenName: true;
        surname: true;
        email: true;
        image: true;
      };
    };
    diaries: {
      select: {
        id: true;
        created: true;
        date: true;
        text: true;
        createdBy: {
          select: {
            id: true;
            givenName: true;
            surname: true;
            email: true;
          };
        };
      };
    };
    inspections: {
      select: {
        id: true;
        date: true;
        note: true;
        result: true;
        kind: true;
        inspectionUser: {
          select: {
            id: true;
            givenName: true;
            surname: true;
            email: true;
          };
        };
      };
    };
  };
}>;
