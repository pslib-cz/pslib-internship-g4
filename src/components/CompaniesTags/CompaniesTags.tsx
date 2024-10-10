"use client"

import { useEffect, useState, useCallback } from "react";
import { Badge, Alert, rem } from "@mantine/core"
import { Tag } from "@prisma/client";
import { IconX } from '@tabler/icons-react';
import { notifications } from "@mantine/notifications";

type CompaniesTagsProps = {
    companyId: number;
    editable: boolean;
}

const fetchData = (companyId: number) => {
    return fetch(`/api/companies/${companyId}/tags`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .catch((error) => {
            throw error;
        });
}

const CompaniesTags = ({ companyId, editable }: CompaniesTagsProps) => {
    const FetchData  = useCallback(() => {
        fetchData(companyId)
            .then((data) => {
                setData(data);
            })
            .catch((error) => {
                setError(error);
            });
    }, [companyId]);
    const RemoveTag = useCallback((tagId: number) => {
        /*fetch(`/api/companies/${companyId}/tags/${tagId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(() => {
                FetchData();
            })
            .catch((error) => {
                setError(error);
            });
            */
           notifications.show({ title: 'Úspěch!', message: "Značka " + tagId + " byla odstraněna.", color: 'green' });

        }, [companyId, FetchData]);
    const [data, setData] = useState<Tag[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const icon = <IconX style={{ width: rem(12), height: rem(12) }} />;

    useEffect(() => {
        FetchData()
    }, [FetchData]);
    if (error) {
        return <Alert color="red">{error.message}</Alert>;
    }
    return (
        <>
        {data.map((tag, index) => (
            <Badge 
                key={index} 
                c={tag.color} 
                bg={tag.background} 
                rightSection={editable ? icon : null} 
                onClick={editable ? (e) => {RemoveTag(tag.id)} : ((e) => {})}
                style={{cursor: editable ? "pointer" : "default"}}
                >{tag.text}</Badge>))}
        </>
    );
};

export default CompaniesTags;