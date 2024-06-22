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
