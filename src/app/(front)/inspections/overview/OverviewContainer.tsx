"use client"

import React, {useState, FC} from "react"
import ActiveSetSelector from "./ActiveSetSelector";
import InternshipClassCountTable from "./InternshipClassCountTable";
import CompaniesCountTable from "./CompaniesCountTable";
import {Paper, Title} from "@mantine/core"

const OverviewContainer:FC = () => {
    const [activeSetId, setActiveSetId] = useState<number | null>(null);
    
    return (
        <>
         <Title order={1} mt="sm">Souhrnná data praxí</Title>
         <ActiveSetSelector activeSetId={activeSetId} setActiveSetId={setActiveSetId} />
         <Paper mt="lg" p="lg">
            <Title order={2}>Počty praxí a studentů podle tříd</Title>
            <InternshipClassCountTable setId={activeSetId} />
          </Paper>
          <Paper mt="lg" p="lg">
            <Title order={2}>Počty studentů v jednotlivých firmách</Title>
            <CompaniesCountTable setId={activeSetId} />
          </Paper>
        </>
    )
    }

export default OverviewContainer