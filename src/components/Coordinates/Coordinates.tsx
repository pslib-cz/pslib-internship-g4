import Link from "next/link";
import { Prisma } from "@prisma/client";
import { IconMapPin } from "@tabler/icons-react";
import { Flex, Text } from "@mantine/core";

type CoordinatesProps = {
  latitude: Prisma.Decimal | number | null;
  longitude: Prisma.Decimal | number | null;
};

export const Coordinates: React.FC<CoordinatesProps> = ({
  latitude = null,
  longitude = null,
}) => {
  if (latitude === null || longitude === null) {
    return <span>neznámé</span>;
  }
  return (
    <Link href={`/companies/map?lon=${longitude}&lat=${latitude}`}>
      <Flex align="center">
        <Text>
          {String(latitude)} s.š., {String(longitude)} v.d.
        </Text>
        <IconMapPin size="1em" color="cyan" />
      </Flex>
    </Link>
  );
};

export default Coordinates;
