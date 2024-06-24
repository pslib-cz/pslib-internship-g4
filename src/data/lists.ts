import { Role } from "@/types/auth";

export const tagTypes = [
  { label: "Školní obor", value: "1" },
  { label: "Technologie", value: "2" },
  { label: "Činnost", value: "3" },
  { label: "Jazyk", value: "4" },
  { label: "Ostatní", value: "5" },
];

export function getTagLabel(value: string): string | undefined {
  const tag = tagTypes.find((tag) => tag.value === value);
  return tag ? tag.label : undefined;
}

export const roleTypes = [
  { label: "Administrátor", value: Role.ADMIN },
  { label: "Učitel", value: Role.TEACHER },
  { label: "Student", value: Role.STUDENT },
  { label: "Host", value: Role.GUEST },
  { label: "Administrátor nebo učitel", value: Role.MANAGER },
];

export function getRoleLabel(value: string): string | undefined {
  const role = roleTypes.find((tag) => tag.value === value);
  return role ? role.label : undefined;
}
