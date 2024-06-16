"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { ActionIcon, ActionIconProps } from "@mantine/core";
import { IconLogin, IconLogout } from "@tabler/icons-react";

export const SignInIcon = ({ ...rest }) => {
  return (
    <ActionIcon
      title="Přihlášení uživatele"
      size="lg"
      onClick={() => signIn("microsoft-entra-id", { redirectTo: "/" })}
      {...rest}
    >
      <IconLogin />
    </ActionIcon>
  );
};

export const SignOutIcon = ({ ...rest }) => {
  return (
    <ActionIcon
      title="Odhlášení uživatele"
      size="lg"
      onClick={() => signOut()}
      {...rest}
    >
      <IconLogout />
    </ActionIcon>
  );
};

interface SignIconProps extends ActionIconProps {}

export const SignIcon: React.FC<SignIconProps> = ({ ...rest }) => {
  const { data: session } = useSession();
  if (session) {
    return <SignOutIcon {...rest} />;
  }
  return <SignInIcon {...rest} />;
};

export default SignIcon;
