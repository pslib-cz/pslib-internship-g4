"use client"

import Link from 'next/link'
import {ScrollArea, Title, Box, Button, Breadcrumbs, Anchor, Text } from "@mantine/core"
import { IconPlus } from '@tabler/icons-react'

const Page = () => {
    return (
        <>
            <Breadcrumbs separatorMargin="md" m="xs">
                <Anchor component={Link} href="/dashboard">Administrace</Anchor>
                <Text>Sady</Text>
            </Breadcrumbs>
            <Title order={2}>Sady</Title>
            <Box my={10}>
                <Button component={Link} href="/dashboard/sets/create" variant="default" leftSection={<IconPlus />}>Nový</Button>
            </Box>
            <ScrollArea type="auto">

            </ScrollArea>
        </>
    )
}

export default Page;