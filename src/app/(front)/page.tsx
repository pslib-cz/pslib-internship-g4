import Link from "next/link";

const Page = () => {
  return (
    <div>
      <h1>Titulní stránka</h1>
      <ul>
        <li>
          <Link href="/sign">Přihlášení/odhlášení</Link>
        </li>
        <li>
          <Link href="/internships">Praxe</Link>
        </li>
        <li>
          <Link href="/dashboard">Administrace</Link>
        </li>
        <li>
          API
          <ul>
            <li>
              <Link href="/api/account">Vlastní účet</Link>
            </li>
            <li>
              <Link href="/api/companies">Firmy</Link>
            </li>
            <li>
              <Link href="/api/locations">Místa</Link>
            </li>
            <li>
              <Link href="/api/sets">Sady</Link>
            </li>
            <li>
              <Link href="/api/templates">Šablony</Link>
            </li>
            <li>
              <Link href="/api/users">Uživatelé</Link>
            </li>
            <li>
              <Link href="/api/tags">Značky</Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Page;
