import { Role } from "../types/auth";
import { useSession } from "next-auth/react";

export default function isAdmin(Component: any) {
  return function IsAdmin(props: any) {
    const { data: session, status } = useSession();

    if (!session) {
      return <p>Nepřihlášený uživatel</p>;
    }
    if (session.user?.role !== Role.ADMIN) {
      return <p>Přístup odepřen</p>;
    }

    return <Component {...props} />;
  };
}
