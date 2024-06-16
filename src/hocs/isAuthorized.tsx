import { auth } from "@/auth";

export default function isAuthorized(Component: any) {
  return async function IsAuthorized(props: any) {
    const session = await auth();

    if (!session) {
      return <p>Nepřihlášený uživatel</p>;
    }

    return <Component {...props} />;
  };
}
