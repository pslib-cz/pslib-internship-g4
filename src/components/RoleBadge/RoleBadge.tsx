import { Badge } from "@mantine/core";
import { Role } from "@/types/auth";

export const RoleBadge = ({
  role,
}: {
  role: Role | string | null | undefined;
}) => {
  switch (role?.toString()) {
    case Role.ADMIN:
      return (
        <Badge color="red" variant="filled" m="sm">
          Administrátor
        </Badge>
      );
    case Role.TEACHER:
      return (
        <Badge color="green" variant="filled" m="sm">
          Učitel
        </Badge>
      );
    case Role.STUDENT:
      return (
        <Badge color="blue" variant="filled" m="sm">
          Student
        </Badge>
      );
    case Role.GUEST:
      return (
        <Badge color="gray" variant="filled" m="sm">
          Host
        </Badge>
      );
    default:
      return (
        <Badge color="white" variant="filled" m="sm">
          Neznámý
        </Badge>
      );
  }
};

export default RoleBadge;
