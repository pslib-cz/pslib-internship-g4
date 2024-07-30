import { Container, Box, Grid, GridCol } from "@mantine/core";
import Link from "next/link";

const ApiOutputsSection = () => {
  return (
    <Box>
      <Container>
        <h2>API</h2>
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
            <Link href="/api/texts">Texty</Link>
          </li>
          <li>
            <Link href="/api/users">Uživatelé</Link>
          </li>
          <li>
            <Link href="/api/tags">Značky</Link>
          </li>
          <li>
            <Link href="/api/internships">Praxe</Link>
          </li>
        </ul>
      </Container>
    </Box>
  );
};

export default ApiOutputsSection;
