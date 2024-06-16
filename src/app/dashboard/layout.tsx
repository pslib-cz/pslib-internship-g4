"use client"

import { useContext } from "react";
import { AccountDrawerContext } from "@/providers/AccountDrawerProvider";
import isAdmin from "@/hocs/isAdminClient";
import {MainLogo, ThemeIcon, SignButton, SignIcon, UserAvatar} from '@/components';
import { AppShell, ScrollArea, NavLink, Group, Divider, Burger, Drawer, rem, Flex, Box, Avatar, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks'
import { usePathname } from 'next/navigation'
import Link from 'next/link';
import {IconArrowBackUp, IconHomeDollar, IconUser, IconMapPin, IconClockDollar, IconFolder, IconCalendar, IconTag, IconCheckbox, IconTemplate} from '@tabler/icons-react'
import { useSession } from "next-auth/react"

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const { opened, close, open } = useContext(AccountDrawerContext);
    const { data: session, status } = useSession();
    const pathname = usePathname()
  return (
    <AppShell
      header={{ height: 60}}
      padding="md"
      navbar={{
        width: 200,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Group justify="space-between" h="100%" mx="sm">
          <Group justify="space-between" h="100%" mx="sm">
            <Link href="/">
              <MainLogo />
            </Link>
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
      <AppShell.Navbar p={0}>
            <NavLink component={Link} href="/" label="Zpět" leftSection={<IconArrowBackUp />} />
            <Divider />
            <NavLink component={Link} href="/dashboard/diaries" label="Deníky" leftSection={<IconCalendar />} active={pathname.includes("/dashboard/diaries")}/>
            <NavLink component={Link} href="/dashboard/companies" label="Firmy" leftSection={<IconHomeDollar />} active={pathname.includes("/dashboard/companies")}/>
            <NavLink component={Link} href="/dashboard/inspections" label="Kontroly" leftSection={<IconCheckbox />} active={pathname.includes("/dashboard/inspections")}/>
            <NavLink component={Link} href="/dashboard/locations" label="Místa" leftSection={<IconMapPin />} active={pathname.includes("/dashboard/locations")}/>
            <NavLink component={Link} href="/dashboard/internships" label="Praxe" leftSection={<IconClockDollar />} active={pathname.includes("/dashboard/internships")}/>
            <NavLink component={Link} href="/dashboard/sets" label="Sady" leftSection={<IconFolder />} active={pathname.includes("/dashboard/sets")}/>
            <NavLink component={Link} href="/dashboard/templates" label="Šablony" leftSection={<IconTemplate />} active={pathname.includes("/dashboard/templates")}/>
            <NavLink component={Link} href="/dashboard/users" label="Uživatelé" leftSection={<IconUser />} active={pathname.includes("/dashboard/users")} />
            <NavLink component={Link} href="/dashboard/tags" label="Značky" leftSection={<IconTag />} active={pathname.includes("/dashboard/tags")}/>
          </AppShell.Navbar>
          <AppShell.Main>
          {children}
          </AppShell.Main>
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
            <NavLink component={Link} href="/dashboard/diaries" label="Deníky" leftSection={<IconCalendar />} active={pathname.includes("/dashboard/diaries")}/>
            <NavLink component={Link} href="/dashboard/companies" label="Firmy" leftSection={<IconHomeDollar />} active={pathname.includes("/dashboard/companies")}/>
            <NavLink component={Link} href="/dashboard/inspections" label="Kontroly" leftSection={<IconCheckbox />} active={pathname.includes("/dashboard/inspections")}/>
            <NavLink component={Link} href="/dashboard/locations" label="Místa" leftSection={<IconMapPin />} active={pathname.includes("/dashboard/locations")}/>
            <NavLink component={Link} href="/dashboard/internships" label="Praxe" leftSection={<IconClockDollar />} active={pathname.includes("/dashboard/internships")}/>
            <NavLink component={Link} href="/dashboard/sets" label="Sady" leftSection={<IconFolder />} active={pathname.includes("/dashboard/sets")}/>
            <NavLink component={Link} href="/dashboard/templates" label="Šablony" leftSection={<IconTemplate />} active={pathname.includes("/dashboard/templates")}/>
            <NavLink component={Link} href="/dashboard/users" label="Uživatelé" leftSection={<IconUser />} active={pathname.includes("/dashboard/users")} />
            <NavLink component={Link} href="/dashboard/tags" label="Značky" leftSection={<IconTag />} active={pathname.includes("/dashboard/tags")}/>
            <Divider my="sm" />
            <Group justify="center" grow pb="xl" px="md">
                <ThemeIcon />
                <SignButton/>
            </Group>
        </ScrollArea>
      </Drawer>
    </AppShell>
  );
};

export default isAdmin(DashboardLayout);
