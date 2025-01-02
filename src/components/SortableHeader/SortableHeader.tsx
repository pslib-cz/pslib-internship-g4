import React, { FC } from "react";
import { Text } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

type SortableHeaderProps = {
  label: string; // Název záhlaví
  currentOrder: string; // Aktuální řazení
  columnKey: string; // Klíč pro sloupec
  onSort: (newOrder: string) => void; // Callback pro změnu řazení
};

export const SortableHeader: FC<SortableHeaderProps> = ({
  label,
  currentOrder,
  columnKey,
  onSort,
}) => {
  const isAsc = currentOrder === columnKey;
  const isDesc = currentOrder === `${columnKey}_desc`;

  const handleClick = () => {
    const newOrder = isAsc ? `${columnKey}_desc` : columnKey;
    onSort(newOrder);
  };

  return (
    <Text
      fw={700}
      onClick={handleClick}
      style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
    >
      {label}{" "}
      {isAsc ? (
        <IconChevronDown size={12} />
      ) : isDesc ? (
        <IconChevronUp size={12} />
      ) : null}
    </Text>
  );
};

export default SortableHeader;