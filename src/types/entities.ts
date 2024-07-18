import { Prisma } from "@prisma/client";

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
    user: {
      select: {
        givenName: true;
        surname: true;
      };
    };
    company: {
      select: {
        name: true;
        companyIdentificationNumber: true;
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
      };
    };
    reservationUser: {
      select: {
        givenName: true;
        surname: true;
      };
    };
  };
}>;

export type InternshipExpandedRecord = Prisma.InternshipGetPayload<{
  select: {
    user: {
      select: {
        givenName: true;
        surname: true;
      };
    };
    company: {
      select: {
        name: true;
        companyIdentificationNumber: true;
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
      };
    };
    reservationUser: {
      select: {
        givenName: true;
        surname: true;
      };
    };
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
