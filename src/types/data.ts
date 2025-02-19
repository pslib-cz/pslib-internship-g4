export type ListResult<T> = {
  data: T[];
  count: number;
  total: number;
  page: number | null;
  size: number | null;
};

export type PlaceCoordinates = {
  lat: number | null;
  lon: number | null;
};

export type PlaceLocation = {
  country: string;
  municipality: string;
  street: string;
  descNumber: string;
  orientNumber: number;
  postalCode: string;
  text: string;
};

export type SelectItem = { value: string; label: string };

export enum TagType {
  SCHOOL_BRANCH = 1,
  TECHNOLOGY = 2,
  INDUSTRY_BRANCH = 3,
  LANGUAGE = 4,
}

export enum InspectionResult {
  UNKNOWN = 0, // neznámý
  OK = 1, // v pořádku
  PROBLEMS = 2, // se studentem jsou problémy
  NOT_PRESENT = 3, // student nebyl přítomen
  NOT_KNOWN = 4, // o studentovi nevědí
}

export enum InspectionType {
  OTHER = 0,
  BY_VISIT = 1,
  BY_PHONE = 2,
  BY_EMAIL = 3,
}

export enum PublicationTarget {
  NONE = 0,
  FRONT = 1,
}

export enum InternshipState {
  FOUNDED = 0, // čerstvě založená praxe
  APPROVED = 1, // schválená učitelem
  CONFIRMED = 2, // potvrzená firmou, přihláška ve firmě a ve škole
  IN_PROGRESS = 3, // probíhající praxe
  DENIED = 4, // firma nebo vyučující praxi zamítli
  CANCELLED = 5, // praxe byla zrušena firmou, studentem nebo školou
  COMPLETED = 6, // praxe byla úspěšně absolvována
}
