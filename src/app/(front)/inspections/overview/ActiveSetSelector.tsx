import React, {useState, useEffect, FC} from "react"
import {NativeSelect, Alert, Loader} from "@mantine/core"
import { Set } from "@prisma/client";

type ActiveSetSelectorProps = {
    activeSetId: number | null;
    setActiveSetId: (id: number | null) => void;
}

const ActiveSetSelector:FC<ActiveSetSelectorProps> = ({activeSetId, setActiveSetId}) => {
    const [sets, setSets] = useState<Set[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const fetchActiveSets = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/sets?active=true");
            if (!response.ok) {
                throw new Error("Failed to fetch sets");
            }
            const data = await response.json();
            setSets(data.data);
        } catch (error) {
            if (error instanceof Error) {
                setError(error);
            } else {
            setError(new Error("An unknown error occurred"));
            }
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchActiveSets();
    }, []);
    if (loading) {
        return <Loader type="dots" />
    }
    if (error) {
        return <Alert color="red">{error.message}</Alert>
    }
    return (
        <>
        <NativeSelect
            data={[{value:"", label: "-- vše --"},...sets.map((set) => ({value: set.id.toString(), label: set.name}))]}
            value={activeSetId?.toString()}
            onChange={(e) => setActiveSetId(parseInt(e.currentTarget.value))}
            mt="sm"
        />
        </>
    )
}

export default ActiveSetSelector;