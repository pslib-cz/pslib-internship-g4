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
