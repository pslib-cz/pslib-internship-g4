import { Role } from "../types/auth";
import { useSession } from "next-auth/react";

export default function isTeacher(Component: any) {
  return function IsTeacher(props: any) {
    const { data: session, status } = useSession();

    if (!session) {
      return <p>Nepřihlášený uživatel</p>;
    }
    if (
      session.user?.role !== Role.ADMIN &&
      session.user?.role !== Role.TEACHER
    ) {
      return <p>Přístup odepřen</p>;
    }

    return <Component {...props} />;
  };
}
