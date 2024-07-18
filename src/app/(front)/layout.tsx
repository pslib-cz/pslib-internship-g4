"use client";

import { useContext } from "react";
import { AccountDrawerContext } from "@/providers/AccountDrawerProvider";
import Link from "next/link";
import {
  AppShell,
  Group,
  Burger,
  Flex,
  Divider,
  Drawer,
  ScrollArea,
  rem,
} from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { Role } from "@/types/auth";
import {
  SignButton,
  UserAvatar,
  SignIcon,
  ThemeIcon,
  MainLogo,
} from "@/components";
import styles from "./layout.module.css";

type LayoutProps = {
  children?: React.ReactNode;
};

const FrontLayout = ({ children }: LayoutProps) => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { opened, close, open } = useContext(AccountDrawerContext);
  const pinned = useHeadroom({ fixedAt: 120 });
  const { data: session } = useSession();
  return (
    <AppShell
      header={{ height: 60, collapsed: !pinned, offset: false }}
      padding="md"
    >
      <AppShell.Header>
        <Group justify="space-between" h="100%" mx="sm">
          <Group justify="space-between" h="100%" mx="sm">
            <Link href="/">
              <MainLogo />
            </Link>
          </Group>
          <Group
            h="100%"
            gap={0}
            visibleFrom="sm"
            className={styles.navigation}
          >
            {session && (
              <Link href="/internships" className={styles.link}>
                Praxe
              </Link>
            )}
            <Link href="/companies" className={styles.link}>
              Firmy
            </Link>
            {session &&
              (session?.user.role == Role.ADMIN ||
                session?.user.role == Role.TEACHER) && (
                <Link href="/inspections" className={styles.link}>
                  Kontroly
                </Link>
              )}
            {session && session?.user.role == Role.ADMIN && (
              <Link href="/dashboard" className={styles.link}>
                Administrace
              </Link>
            )}
          </Group>
          <Group>
            <Flex visibleFrom="sm" gap="sm">
              <UserAvatar
                picture={
                  session?.user?.image
                    ? "data:image/jpeg;base64, " + session?.user?.image
                    : null
                }
                fullname={session?.user?.name}
                email={session?.user?.email}
                onClick={open}
              />
              <ThemeIcon />
              <SignIcon hiddenFrom="md" />
              <SignButton visibleFrom="md" />
            </Flex>
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="sm"
            />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main className={styles.pageContent}>{children}</AppShell.Main>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigace"
        hiddenFrom="sm"
        zIndex={500}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />
          {session && (
            <Link href="/internships" className={styles.link}>
              Praxe
            </Link>
          )}
          <Link href="/companies" className={styles.link}>
            Firmy
          </Link>
          {session &&
            (session?.user.role == "admin" ||
              session?.user.role == "teacher") && (
              <Link href="/inspections" className={styles.link}>
                Kontroly
              </Link>
            )}
          {session && session?.user.role == "admin" && (
            <Link href="/dashboard" className={styles.link}>
              Administrace
            </Link>
          )}
          <Divider my="sm" />
          <Group justify="center" grow pb="xl" px="md">
            <SignButton />
            <ThemeIcon />
          </Group>
        </ScrollArea>
      </Drawer>
    </AppShell>
  );
};

export default FrontLayout;
