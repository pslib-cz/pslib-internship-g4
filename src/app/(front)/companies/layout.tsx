"use client"

import React, {useContext} from 'react';
import { Group, Drawer, ScrollArea, Text, Grid, Button, TextInput, NumberInput } from '@mantine/core'
import { useSession } from "next-auth/react"
import FilterProvider, {FilterContext} from '@/providers/CompanyFilterProvider';
import { useMediaQuery } from '@mantine/hooks'

type Props = {
    children?: React.ReactNode;
  };

const FilterDrawer = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(max-width: 992px)');
    const { 
        opened, 
        close, 
        filterName, 
        setFilterName,
        filterTaxNum,
        setFilterTaxNum,
        filterActive,
        setFilterActive,
        filterMunicipality,
        setFilterMunicipality,
        orderBy
    } = useContext(FilterContext);
    return (
        <Drawer opened={opened} onClose={close} padding="md" title="Filtrování firem" zIndex={1000} position="top">
                <Grid w="100%">
                    <Grid.Col span={isMobile ? 12 : (isTablet ? 6 : 4)}>
                        <TextInput label="Název" value={filterName} onChange={(event) => setFilterName(event.currentTarget.value)}/>
                    </Grid.Col>
                    <Grid.Col span={isMobile ? 12 : (isTablet ? 6 : 4)}>
                        <NumberInput label="IČO" value={filterTaxNum} onChange={(value) => setFilterTaxNum(value === "" ? undefined : Number(value))}/>
                    </Grid.Col>
                    <Grid.Col span={isMobile ? 12 : (isTablet ? 6 : 4)}>
                        <TextInput label="Sídlo firmy (obec)" value={filterMunicipality} onChange={(event) => setFilterMunicipality(event.currentTarget.value)}/>
                    </Grid.Col>
                    <Grid.Col span={isMobile ? 12 : (isTablet ? 6 : 4)}>
                        <Text size="sm">Aktivní</Text>
                        <Button.Group>
                            <Button onClick={() => setFilterActive(true)} color={filterActive === true ? "blue" : "gray"}>Ano</Button>
                            <Button onClick={() => setFilterActive(false)} color={filterActive === false ? "blue" : "gray"}>Ne</Button>
                            <Button onClick={() => setFilterActive(undefined)} color={filterActive === undefined ? "blue" : "gray"}>Vše</Button>
                        </Button.Group>
                    </Grid.Col>
                </Grid>
            <Group my="sm">
                <ScrollArea>

                </ScrollArea>  
            </Group>
        </Drawer>
    );

}

const FrontLayout = ({ children }: Props) => {
    const { data: session, status } = useSession();
    return (
        <FilterProvider>
        {children}
        <FilterDrawer />
        </FilterProvider>
    );
}

export default FrontLayout;