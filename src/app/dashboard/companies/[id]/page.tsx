"use client"

import React, {useState, useEffect, Suspense} from 'react';
import { Title, Box, Text, Alert, Breadcrumbs, Anchor, Loader, Grid, Card } from "@mantine/core"
import { CompanyWithLocationAndCreator } from "@/types/entities";
import Link from 'next/link'
import Address from '@/components/Address/Address'
import Coordinates from '@/components/Coordinates/Coordinates'
import { useMediaQuery } from '@mantine/hooks'
import DateTime from "@/components/DateTime/DateTime"
import BranchesSwitch from "./BranchesSwitch"
import TagsDisplay from './TagsDisplay';

const DataDisplay = ({id}:{id: number}) => {
    const [company, setCompany] = useState<CompanyWithLocationAndCreator | null>(null);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        fetch(`/api/companies/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(async (response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Nepodařilo se načíst firmu');
        })
        .then((data) => {
            setCompany(data);
        })
        .catch((error) => {
            setError(error);
        });
    }, [id]);
    if (error) {
        return (
            <Alert color="red" title="Chyba">
                {error.message}
            </Alert>
        );
    }
    return (
        <>
            <Title order={2}>{company?.name}</Title>
            <Text fw={700}>IČO</Text>
            <Text>{company?.companyIdentificationNumber ? String(company?.companyIdentificationNumber).padStart(8,"0") :"neznámé"}</Text>
            {company?.website && 
                <>
                <Text fw={700}>Webová stránka</Text>
                <Anchor href={company?.website}>{company?.website ?? ""}</Anchor>
                </>
            }
            {company?.description && 
                <>
                <Text fw={700}>Popis</Text>
                <Box dangerouslySetInnerHTML={{__html: company?.description ?? ""}} />
                </>
            }
            {company?.location.id &&
                <>
                <Text fw={700}>Adresa</Text>
                <Address 
                    street={company?.location.street} 
                    descNum={company?.location.descNo} 
                    orientNum={company?.location.orientNo} 
                    municipality={company?.location.municipality ?? ""} 
                    postalCode={company?.location.postalCode} 
                    country={company?.location.country ?? "Česko"} />
                <Text fw={700}>Souřadnice</Text>
                <Text><Coordinates latitude={company?.location.latitude} longitude={company?.location.longitude} /></Text>
                <Text fw={700}>Přidáno</Text>
                <Text><DateTime date={company.created} locale="cs"/></Text>
                <Text fw={700}>Přidal</Text>
                <Text>{company.creator?.email}</Text>
                </>
            }
        </>
    )
}

const Page = ({ params }: { params: { id: number } }) => {
    const id = params.id;
    const mobile = useMediaQuery('(max-width: 640px)');
    return (
        <>
            <Breadcrumbs separatorMargin="md" m="xs">
                <Anchor component={Link} href="/dashboard">Administrace</Anchor>
                <Anchor component={Link} href="/dashboard/companies">Firmy</Anchor>
                <Text>Detail</Text>
            </Breadcrumbs>
            <Grid justify="flex-start" align="stretch">
                <Grid.Col span={mobile ? 12 : 6}>
                    <Card shadow="sm" padding="lg">
                        <Suspense fallback={<Loader />}>
                            <DataDisplay id={id}/>
                        </Suspense>
                    </Card>
                </Grid.Col>
                <Grid.Col span={mobile ? 12 : 6}>
                    <Card shadow="sm" padding="lg" h="100%">
                        <Title order={2}>Značky</Title>
                        <Suspense fallback={<Loader />}>
                            <TagsDisplay id={id} />
                        </Suspense>
                    </Card>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Card shadow="sm" padding="lg" h="100%">
                        <Title order={2}>Pobočky a místa praxí</Title>
                        <BranchesSwitch id={id} />        
                    </Card>
                </Grid.Col>
            </Grid>
        </>
    );
}  
export default Page