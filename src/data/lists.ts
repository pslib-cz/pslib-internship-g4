import { Role } from "@/types/auth";
import {
  InspectionResult,
  InspectionType,
  PublicationTarget,
  InternshipState,
  SelectItem,
} from "@/types/data";

export const tagTypes: SelectItem[] = [
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

export const internshipKinds: SelectItem[] = [
  { value: "0", label: "Prezenčně na pracovišti" },
  { value: "1", label: "Homeoffice" },
];

export function getInternshipKindLabel(value: string): string | undefined {
  const kind = internshipKinds.find((kind) => kind.value === value);
  return kind ? kind.label : undefined;
}

export const inspectionResults: SelectItem[] = [
  { value: String(InspectionResult.UNKNOWN), label: "Neznámý" },
  { value: String(InspectionResult.OK), label: "OK" },
  {
    value: String(InspectionResult.PROBLEMS),
    label: "Se studentem jsou problémy",
  },
  { value: String(InspectionResult.NOT_PRESENT), label: "Není přítomen" },
  { value: String(InspectionResult.NOT_KNOWN), label: "O studentovi nevědí" },
];

export function getInspectionResultLabel(value: string): string | undefined {
  const result = inspectionResults.find((result) => result.value === value);
  return result ? result.label : undefined;
}

export const inspectionTypes: SelectItem[] = [
  { value: String(InspectionType.OTHER), label: "Ostatní" },
  { value: String(InspectionType.BY_VISIT), label: "Osobní návštěva" },
  { value: String(InspectionType.BY_PHONE), label: "Telefonický rozhovor" },
  { value: String(InspectionType.BY_EMAIL), label: "Email" },
];

export function getInspectionTypeLabel(value: string): string | undefined {
  const type = inspectionTypes.find((type) => type.value === value);
  return type ? type.label : undefined;
}

export const publicationTargets: SelectItem[] = [
  { value: String(PublicationTarget.NONE), label: "Nikde" },
  { value: String(PublicationTarget.FRONT), label: "Titulní strana" },
];

export function getPublicationTargetLabel(value: string): string | undefined {
  const target = publicationTargets.find((target) => target.value === value);
  return target ? target.label : undefined;
}

export const internshipStates: SelectItem[] = [
  { value: String(InternshipState.FOUNDED), label: "Založená" },
  { value: String(InternshipState.APPROVED), label: "Schválená" },
  { value: String(InternshipState.CONFIRMED), label: "Potvrzená" },
  { value: String(InternshipState.IN_PROGRESS), label: "Probíhající" },
  { value: String(InternshipState.COMPLETED), label: "Absolvovaná" },
  { value: String(InternshipState.DENIED), label: "Zamítnutá" },
  { value: String(InternshipState.CANCELLED), label: "Zrušená" },
];

export function getInternshipStateLabel(value: string): string | undefined {
  const state = internshipStates.find((state) => state.value === value);
  return state ? state.label : undefined;
}

export function isValidInternshipState(value: number): boolean {
  return value in InternshipState;
}

export const internshipStateTransitions = {
  [InternshipState.FOUNDED]: [{state: InternshipState.APPROVED, priviledged: false}],
  [InternshipState.APPROVED]: [{state: InternshipState.CONFIRMED, priviledged: false}, {state: InternshipState.DENIED, priviledged: false}],
  [InternshipState.CONFIRMED]: [{state: InternshipState.IN_PROGRESS, priviledged: false}, {state: InternshipState.CANCELLED, priviledged: false}, {state: InternshipState.DENIED, priviledged: false}],
  [InternshipState.IN_PROGRESS]: [{state: InternshipState.COMPLETED, priviledged: true}, {state: InternshipState.CANCELLED, priviledged: true}],
  [InternshipState.COMPLETED]: [],
  [InternshipState.DENIED]: [],
  [InternshipState.CANCELLED]: [],
};

export function canTransition(currentState: InternshipState, proposedState: InternshipState, isPrivileged: boolean): boolean {
  const transitions = internshipStateTransitions[currentState];
  if (!transitions) return false;

  return transitions.some(transition => 
    transition.state === proposedState && (!transition.priviledged || isPrivileged)
  );
}