import { signIn, signOut, auth } from "@/auth";
import Image from "next/image";

export const runtime = "nodejs";

const Page = async () => {
  const session = await auth();
  return (
    <>
      <p>{session?.user?.name}</p>
      <p>{session?.user?.email}</p>
      <pre>{JSON.stringify(session)}</pre>
      {session?.user?.image && (
        <Image
          src={"data:image/jpeg;base64, " + session?.user?.image}
          alt="User Avatar"
          height={64}
          width={64}
        />
      )}
      {session ? (
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit">Odhlášení</button>
        </form>
      ) : (
        <>
          <form
            action={async () => {
              "use server";
              await signIn("microsoft-entra-id");
            }}
          >
            <button type="submit">Přihlášení pomocí EntraID</button>
          </form>
        </>
      )}
    </>
  );
};

export default Page;
