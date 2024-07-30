import Link from "next/link";
import { Title, SimpleGrid, Card, UnstyledButton, Text } from "@mantine/core";
import {
  IconHomeDollar,
  IconUser,
  IconMapPin,
  IconClockDollar,
  IconFolder,
  IconTag,
  IconCheckbox,
  IconTemplate,
  IconCalendar,
  IconTextCaption,
} from "@tabler/icons-react";
import classes from "./page.module.css";

const Page = () => {
  return (
    <div>
      <Title order={2} mb="lg">
        Administrace
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Card withBorder radius="md">
          <SimpleGrid cols={{ base: 2, lg: 5 }}>
            <UnstyledButton
              component={Link}
              href="/dashboard/diaries"
              className={classes.item}
            >
              <IconCalendar size={24} />
              <Text size="xs" mt={7}>
                Deníky
              </Text>
            </UnstyledButton>
            <UnstyledButton
              component={Link}
              href="/dashboard/companies"
              className={classes.item}
            >
              <IconHomeDollar size={24} />
              <Text size="xs" mt={7}>
                Firmy
              </Text>
            </UnstyledButton>
            <UnstyledButton
              component={Link}
              href="/dashboard/inspections"
              className={classes.item}
            >
              <IconCheckbox size={24} />
              <Text size="xs" mt={7}>
                Kontroly
              </Text>
            </UnstyledButton>
            <UnstyledButton
              component={Link}
              href="/dashboard/locations"
              className={classes.item}
            >
              <IconMapPin size={24} />
              <Text size="xs" mt={7}>
                Místa
              </Text>
            </UnstyledButton>
            <UnstyledButton
              component={Link}
              href="/dashboard/internships"
              className={classes.item}
            >
              <IconClockDollar size={24} />
              <Text size="xs" mt={7}>
                Praxe
              </Text>
            </UnstyledButton>
            <UnstyledButton
              component={Link}
              href="/dashboard/sets"
              className={classes.item}
            >
              <IconFolder size={24} />
              <Text size="xs" mt={7}>
                Sady
              </Text>
            </UnstyledButton>
            <UnstyledButton
              component={Link}
              href="/dashboard/templates"
              className={classes.item}
            >
              <IconTemplate size={24} />
              <Text size="xs" mt={7}>
                Šablony
              </Text>
            </UnstyledButton>
            <UnstyledButton
              component={Link}
              href="/dashboard/texts"
              className={classes.item}
            >
              <IconTextCaption size={24} />
              <Text size="xs" mt={7}>
                Texty
              </Text>
            </UnstyledButton>
            <UnstyledButton
              component={Link}
              href="/dashboard/users"
              className={classes.item}
            >
              <IconUser size={24} />
              <Text size="xs" mt={7}>
                Uživatelé
              </Text>
            </UnstyledButton>
            <UnstyledButton
              component={Link}
              href="/dashboard/tags"
              className={classes.item}
            >
              <IconTag size={24} />
              <Text size="xs" mt={7}>
                Značky
              </Text>
            </UnstyledButton>
          </SimpleGrid>
        </Card>
      </SimpleGrid>
    </div>
  );
};

export default Page;
