import { Box, Button, Text, Anchor, Breadcrumbs, ScrollArea, Title, Container } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"
import Link from "next/link"
import isAuthorized from "@/hocs/isAuthorized"
import InternshipsList from "./InternshipsList";

const Page = () => {
  return (
    <>
    <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/">
          Titulní stránka
        </Anchor>
        <Text>Moje praxe</Text>
      </Breadcrumbs>
      <Container>
      <Title order={2}>Moje praxe</Title>
      <ScrollArea type="auto">
        <InternshipsList />
      </ScrollArea>
      </Container>
      </>
  );
};

export default isAuthorized(Page);
