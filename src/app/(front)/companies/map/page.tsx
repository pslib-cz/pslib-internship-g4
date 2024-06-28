"use client"

import {useContext, Suspense, useMemo} from "react"
import { Breadcrumbs, Anchor, Text, Title, LoadingOverlay, Box, ActionIcon, Flex } from '@mantine/core'
import Link from 'next/link';
import { IconFilter } from '@tabler/icons-react';
import { FilterContext } from '@/providers/CompanyFilterProvider' 
import dynamic from 'next/dynamic'

const Page = () => {
    const { opened, open, close, filterName, setFilterName, filterTaxNum, setFilterTaxNum, filterActive, setFilterActive, filterMunicipality, setFilterMunicipality, orderBy, setOrderBy } = useContext(FilterContext);
    /*const MapDisplay = useMemo(() => dynamic(
        () => import('./MapDisplay'),
        {
            loading: () => <LoadingOverlay />, 
            ssr: false 
        }
    ),[]);*/
    return(
        <>
        <Breadcrumbs separatorMargin="md" mt="xs">
            <Anchor component={Link} href="/">Titulní stránka</Anchor>
            <Anchor component={Link} href="/companies">Firmy</Anchor>
            <Text>Mapa</Text>
        </Breadcrumbs>
        <Flex gap="md" my="lg"  justify="flex-start" align="flex-start" direction="row">
            <Title order={2}>Mapa firem</Title>
            <ActionIcon variant="light" onClick={open}><IconFilter /></ActionIcon>
        </Flex>
        <Box>
        <Suspense fallback={<LoadingOverlay />}>

        </Suspense>
        </Box>
        </>
    )
}

export default Page;