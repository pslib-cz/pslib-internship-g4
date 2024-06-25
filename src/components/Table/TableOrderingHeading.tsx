import {Text} from "@mantine/core";
import {IconChevronDown, IconChevronUp} from "@tabler/icons-react";

type TableOrderingHeadingProps = {
    text: string;
    property: string;
    setProperty: (property: string) => void;
    orderValue: string;
    descendingAppendix: string;
}

export const TableOrderingHeading = ({
    text,
    property,
    orderValue,
    descendingAppendix = "_desc",
}: TableOrderingHeadingProps) => {
    return (
        <Text
                fw={700}
                onClick={() => {
                  let newOrder = property === orderValue ? orderValue + descendingAppendix : orderValue;
                  //setProperty({ ...state, order: newOrder });
                }}
                style={{ cursor: "pointer" }}
              >
                {text}{" "}
                {property === orderValue ? (
                  <IconChevronDown size={12} />
                ) : property === orderValue + descendingAppendix ? (
                  <IconChevronUp size={12} />
                ) : null}
              </Text>
    );
}

export default TableOrderingHeading;