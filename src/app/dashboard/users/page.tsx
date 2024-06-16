"use client"

import Link from 'next/link'
import {ScrollArea, Title, Box, Button, Breadcrumbs, Anchor, Text } from "@mantine/core"
import { IconUserPlus } from '@tabler/icons-react'

const Page = () => {
    return (
        <>
            <Breadcrumbs separatorMargin="md" m="xs">
                <Anchor component={Link} href="/dashboard">Administrace</Anchor>
                <Text>Uživatelé</Text>
            </Breadcrumbs>
            <Title order={2}>Uživatelé</Title>
            <Box my={10}>
                <Button component={Link} href="/dashboard/users/create" variant="default" leftSection={<IconUserPlus />}>Nový</Button>
            </Box>
            <ScrollArea type="auto">

            </ScrollArea>
        </>
    )
}

export default Page;