"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button, ButtonProps } from "@mantine/core";
import { IconLogin, IconLogout } from "@tabler/icons-react";

export const SignInButton = ({ ...rest }) => {
  return (
    <Button
      onClick={() => signIn("microsoft-entra-id", { redirectTo: "/" })}
      leftSection={<IconLogin />}
      {...rest}
    >
      Přihlásit
    </Button>
  );
};

export const SignOutButton = ({ ...rest }) => {
  return (
    <Button onClick={() => signOut()} leftSection={<IconLogout />} {...rest}>
      Odhlásit
    </Button>
  );
};

interface SignButtonProps extends ButtonProps {}

export const SignButton: React.FC<SignButtonProps> = ({ ...rest }) => {
  const { data: session } = useSession();
  if (session) {
    return <SignOutButton {...rest} />;
  }
  return <SignInButton {...rest} />;
};

export default SignButton;
