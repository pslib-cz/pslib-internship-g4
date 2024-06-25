import React from "react";

interface DateProps {
  date: Date | null;
  locale: string; // Specify the desired locale (e.g., 'en-US', 'fr-FR', etc.)
}

export const DateTime: React.FC<DateProps> = ({ date, locale = "cs-CZ" }) => {
  if (!date) return "?";
  const d = new Date(date);
  const diso = d.toISOString();
  const dstr = d.toLocaleDateString(locale);
  return <time dateTime={diso}>{dstr}</time>;
};

export default DateTime;
