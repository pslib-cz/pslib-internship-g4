import {
  Container,
  Timeline,
  TimelineItem,
  Title,
  Box,
  Text,
  Anchor,
} from "@mantine/core";
import Link from "next/link";
import styles from "./CreateInternshipSection.module.css";
import {
  IconGitBranch,
  IconGitPullRequest,
  IconGitCommit,
  IconMessageDots,
} from "@tabler/icons-react";

const CreateInternshipSection = () => {
  return (
    <Box className={styles.panel}>
      <Container>
        <Title order={2}>Založení praxe</Title>
        <Timeline mt="1rem" bulletSize={32} lineWidth={2}>
          <TimelineItem bullet={1} title="Najděte si vhodnou firmu">
            <Text>
              Můžete ji najít v našem{" "}
              <Anchor component={Link} href="/companies">
                seznamu
              </Anchor>{" "}
              nebo na{" "}
              <Anchor component={Link} href="/companies/map">
                mapě
              </Anchor>
              . Mohou Vám s jejím výběrem pomocí Vaši rodiče, učitelé nebo
              spolužáci.
            </Text>
            <Text>
              Pokud zatím v naší databázi není, budete ji tam muset{" "}
              <Anchor component={Link} href="/companies/import">
                přidat
              </Anchor>
              .
            </Text>
          </TimelineItem>
          <TimelineItem bullet={2} title="Domluvte se s zástupcem firmy">
            <Text>
              Zjistěte co tam budete dělat, kdo Vám bude zadávat práci a povede
              Vás tak celou praxí.
            </Text>
            <Text>
              Pro vyplnění přihlášky budete potřebovat jméno, email a telefon
              vašeho vedoucího ve firmě případně i nějakého odpovědného
              pracovníka. Zjistěte také, jak by se na Vaši kontrolu mohl
              zastavit učitel na kontrolu.
            </Text>
          </TimelineItem>
          <TimelineItem
            bullet={3}
            title="Přihlaste se na praxi a vygenerujte potřebnou dokumentaci"
          >
            <Text>
              Formulář{" "}
              <Anchor component={Link} href="/internships/create">
                přihlášky
              </Anchor>{" "}
              vyplňte po pravdě a co nejúplněji.
            </Text>
            <Text>
              Po vytvoření přihlášky je možné ze{" "}
              <Anchor component={Link} href="/internships">
                seznamu
              </Anchor>{" "}
              stáhnout připravenou smlouvu. Tu dvakrát vytiskněte.
            </Text>
          </TimelineItem>
          <TimelineItem
            bullet={4}
            title="Získejte na smlouvu požadované podpisy"
          >
            <Text>Nejprve nechte oba výtisky podepsat ve firmě.</Text>
            <Text>
              Pak odevzdejte oba podepsané výtisky svému třídnímu ve škole. Ten
              nechá smlouvu podepsat zástupce školy. Škola si jeden výtisk
              rovnou nechá.
            </Text>
            <Text>
              Druhý výtisk odneste zpět do firmy. Vám žádná smlouva nezůstává.
            </Text>
          </TimelineItem>
        </Timeline>
      </Container>
    </Box>
  );
};

export default CreateInternshipSection;
