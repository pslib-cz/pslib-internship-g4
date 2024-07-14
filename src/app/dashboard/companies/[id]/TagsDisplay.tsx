"use client"

import { useEffect, useState } from 'react'
import { Text, Alert } from "@mantine/core"

const TagDisplay = ({id}:{id: number}) => {
    const [tags, setTags] = useState<string[] | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const fetchTags = (companyId: number) => {
        fetch(`/api/companies/${companyId}/tags`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(async (response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Nepodařilo se načíst značky firmy');
        })
        .then((data) => {
            setTags(data);
        })
        .catch((error) => {
            setError(error);
        });
    }
    useEffect(() => {
        fetchTags(id);
    }, [id]);
    if (error) {
        return (
            <Alert color="red" title="Chyba">
                {error.message}
            </Alert>
        );
    }
    if (tags?.length === 0) {
        return (
            <Text>Firma nemá žádné značky</Text>
        );
    }
    return (
        <>
            <ul>
                {tags?.map((tag, index) => (
                    <li key={index}>{tag}</li>
                ))}
            </ul>
        </>
    )
}

export default TagDisplay