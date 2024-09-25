import React from "react";
import { Avatar, Text, Box, Flex } from "@mantine/core";

type UserAvatarProps = {
  picture: string | null | undefined;
  fullname: string | null | undefined;
  email: string | null | undefined;
  onClick?: () => void;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  picture = null,
  fullname,
  email = "",
  onClick,
}) => {
  return (
    <Flex
      gap="sm"
      justify="left"
      align="center"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <Avatar visibleFrom="md" src={picture} radius={40} size={40} />
      <Box>
        <Text fz="sm" fw={500}>
          {fullname}
        </Text>
        <Text fz="xs" c="dimmed">
          {email}
        </Text>
      </Box>
    </Flex>
  );
};

export default UserAvatar;
