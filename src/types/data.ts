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
  UNKNOWN = 0,
  OK = 1,
  PROBLEMS = 2,
  NOT_PRESENT = 3,
  NOT_KNOWN = 4,
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
  FOUNDED = 0,
  APPROVED = 1,
  DELIVERED = 2,
  DENIED = 3,
  CANCELLED = 4,
  COMPLETED = 5,
}
