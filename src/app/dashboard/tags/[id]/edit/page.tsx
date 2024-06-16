"use client"

import React, {useState, useEffect} from 'react';
import { Title, LoadingOverlay, Text, Alert, Breadcrumbs, Anchor, Container, TextInput, Button, Group, ColorInput, NativeSelect } from "@mantine/core"
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {tagTypes} from '@/data/lists'

const Page = ({ params }: { params: { id: string } }) => {
    const id = params.id;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter()
    const form = useForm({
        initialValues: {
          text: "",
          color: "",
          background: "",
          type: "5"
        },
        validate: {
            text: (value) => (value.trim() !== '' ? null : 'Značka musí mít text'),
            color: (value) => (value.trim() !== '' ? null : 'Značka musí mít barvu'),
            background: (value) => (value.trim() !== '' ? null : 'Značka musí mít pozadí'),
            type: (value) => (value.trim() !== '' ? null : 'Značka musí mít typ'),
        },
    });
    useEffect(() => {
        setLoading(true);
        fetch(`/api/tags/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(async (response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Nepodařilo se načíst značku');
        })
        .then((data) => {
            form.setValues({
                text: data.text,
                color: data.color,
                background: data.background,
                type: data.type
            });
        })
        .catch((error) => {
            setError(error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [id]);
    if (error) {
        return (
            <Alert color="red" title="Chyba při načítání nebo ukládání značky">
                {error}
            </Alert>
        );
    }
    return (
        <>
            <Breadcrumbs separatorMargin="md" m="xs">
                <Anchor component={Link} href="/dashboard">Administrace</Anchor>
                <Anchor component={Link} href="/dashboard/tags">Značky</Anchor>
                <Text>Editace</Text>
            </Breadcrumbs>
            <Container>
                <LoadingOverlay visible={loading} />
                <Title order={2}>Editace značky</Title>
                <form onSubmit={form.onSubmit(
                    (values: {
                        text: string;
                        color: string;
                        background: string;     
                        type: string;           
                    }) => {
                        setLoading(true);
                        fetch(`/api/tags/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(values),
                        }).then((response) => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            notifications.show({
                                title: 'Povedlo se!',
                                message: 'Data byla uložena.',
                                color: "lime"
                            })
                            router.push('/dashboard/tags', { scroll: false })
                        }).catch((error) => {
                            notifications.show({
                                title: 'Chyba!',
                                message: 'Nepodařilo se uložit data.',
                                color: "red"
                            })
                            setError(error);
                        }).finally(() => {
                            setLoading(false);
                        });
                    }
                )}>
                <TextInput 
                withAsterisk 
                label="Text" 
                placeholder="" 
                {...form.getInputProps('text')} 
                />
                <NativeSelect 
                withAsterisk
                label="Typ"
                data={tagTypes}
                {...form.getInputProps('type')} />
                <ColorInput 
                label="Barva" 
                {...form.getInputProps('color')} 
                />
                <ColorInput 
                label="Pozadí" 
                {...form.getInputProps('background')} 
                />
                <Group justify="flex-start" mt="md">
                    <Button type="submit">Uložit</Button>
                    <Button component={Link} href="/dashboard/tags" variant="default">Storno</Button>
                </Group>
                </form>
            </Container>
        </>
    );
}

export default Page;