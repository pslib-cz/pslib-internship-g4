"use client"

import Link from 'next/link'
import { Breadcrumbs, Anchor, Text, Title, TextInput, Button, Group, Container, NumberInput } from "@mantine/core";
import { notifications } from '@mantine/notifications'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/navigation'
import { RichTextEditor, Link as TipLink } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder'
import '@mantine/tiptap/styles.css';

const Page = () => {
    const router = useRouter()
    const form = useForm({
        initialValues: {
          name: '',
          companyIdentificationNumber: 0 || undefined,
          description: "Popis" || undefined,
          website: "" || undefined,
          street: "" || undefined,
          descNum: 0 || undefined,
          orientNum: "" || undefined,
          municipality: "Liberec" || undefined,
          country: "Česká republika",
          postalCode: 0 || undefined
        },
        validate: {
            name: (value: String) => (value.trim() !== '' ? null : 'Název je povinný'),
            country: (value: String) => (value.trim() !== '' ? null : 'Stát je povinný'),
            municipality: (value: String) => (value.trim() !== '' ? null : 'Obec je povinná'),
            postalCode: (value: number) => (value > 10000 ? null : 'PSČ je povinné'),
        },
    });
    const editor = useEditor({
        extensions: [
          StarterKit,
          Placeholder.configure({ placeholder: 'Jedna z největších megakorporací světa.' }),
          TipLink,
        ],
        content: '',
        onUpdate({ editor }) {
          form.setValues({ description: editor.getHTML()}); 
        },
    });
    return (
        <>
            <Breadcrumbs separatorMargin="md" mt="xs">
                <Anchor component={Link} href="/">Titulní stránka</Anchor>
                <Anchor component={Link} href="/companies">Firmy</Anchor>
                <Text>Vytvoření</Text>
            </Breadcrumbs>
            <Container mt="md">
            <Title order={2}>Vytvoření nové firmy</Title>
            <form onSubmit={form.onSubmit(
                async (values) => {
                    if (values.website === "") values.website = undefined;
                    let placeLatitude = null;
                    let placeLongitude = null;
                    // Geocoding
                    await fetch(`/api/locations/geo`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            country: values.country,
                            municipality: values.municipality ?? "",
                            street: values.street ?? null,
                            descNumber: values.descNum ?? null,
                            orientNumber: String(values.orientNum) ?? null
                        })
                    })
                    .then(response => {
                        if (response.ok) {
                            return response.json()
                        } else {
                            throw new Error('Network response was not ok');
                        }
                    })
                    .then(data => {
                        placeLatitude = data.lat;
                        placeLongitude = data.lon;
                        notifications.show({
                            title: 'Povedlo se!',
                            message: 'Proběhlo geokódování: ' + placeLatitude + ", " + placeLongitude,
                            color: "lime"
                        })
                    })
                    // Inserting location
                    let locationId = null;
                    fetch('/api/locations', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            country: values.country,
                            municipality: values.municipality,
                            street: values.street ?? null,
                            descNo: values.descNum ? Number(values.descNum) : null,
                            orientNo: values.orientNum,
                            latitude: placeLatitude ?? null,
                            longitude: placeLongitude ?? null,
                            postalCode: values.postalCode ? Number(values.postalCode) : null,
                        }),
                    }).then((response) => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json()
                    }).then((data) => {
                        console.log(data);
                        notifications.show({
                            title: 'Povedlo se!',
                            message: "Místo " + locationId + " bylo vytvořeno.",
                            color: "lime"
                        })
                        fetch('/api/companies', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                name: values.name,
                                companyIdentificationNumber: values.companyIdentificationNumber,
                                description: values.description,
                                website: values.website,
                                locationId: data.id,
                            })
                        })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json()
                        })
                        .then((result) => {
                            notifications.show({
                                title: 'Povedlo se!',
                                message: `Firma byla vytvořena.`,
                                color: "lime"
                            })
                            router.push('/companies/' + result.id, { scroll: false })
                        })
                        .catch((error) => {
                            notifications.show({
                                title: 'Chyba!',
                                message: 'Firmu se nepodařilo vytvořit.',
                                color: "red"
                            })
                        });
                    })      
                    .catch((error) => {
                        notifications.show({
                            title: 'Chyba!',
                            message: 'Místo se nepodařilo vytvořit.',
                            color: "red"
                        })
                    });
                }
            )}>
                <TextInput 
                withAsterisk 
                label="Název" 
                placeholder="Arasaka" 
                {...form.getInputProps('name')} 
                />
                <NumberInput 
                label="IČO" 
                placeholder="0000000" 
                {...form.getInputProps('companyIdentificationNumber')} 
                />
                <Text>Popis</Text>
                <RichTextEditor editor={editor} {...form.getInputProps('description')}>
                    <RichTextEditor.Toolbar>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.Link />
                    </RichTextEditor.Toolbar>
                    <RichTextEditor.Content />
                </RichTextEditor>
                <TextInput  
                label="Webová stránka" 
                placeholder="https://arasaka.cz" 
                {...form.getInputProps('website')} 
                />
                <TextInput  
                label="Ulice" 
                placeholder="Corporate Plaza" 
                {...form.getInputProps('street')} 
                />
                <TextInput  
                label="Číslo popisné" 
                placeholder="1" 
                {...form.getInputProps('descNum')} 
                />
                <TextInput  
                label="Číslo orientační" 
                placeholder="100" 
                {...form.getInputProps('orientNum')} 
                />
                <TextInput  
                withAsterisk 
                label="Obec" 
                placeholder="Night City" 
                {...form.getInputProps('municipality')} 
                />
                <TextInput  
                label="Stát" 
                placeholder="Night City" 
                {...form.getInputProps('country')} 
                />
                <NumberInput  
                label="PSČ" 
                placeholder="11111" 
                {...form.getInputProps('postalCode')} 
                />
                <Group justify="flex-start" mt="md">
                    <Button type="submit">Vytvořit</Button>
                    <Button component={Link} href="/companies" variant="default">Storno</Button>
                </Group>
            </form>
            </Container>
        </>
    );
}

export default Page;