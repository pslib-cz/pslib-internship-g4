"use client";

import React, { useContext, useState, useEffect } from "react";
import {
  Group,
  Drawer,
  ScrollArea,
  Text,
  Grid,
  Button,
  TextInput,
  NumberInput,
  MultiSelect,
} from "@mantine/core";
import {
  FilterProvider,
  FilterContext,
} from "@/providers/CompanyFilterProvider";
import { useMediaQuery } from "@mantine/hooks";

type Props = {
  children?: React.ReactNode;
};

const FilterDrawer = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 992px)");
  const [state, dispatch] = useContext(FilterContext);
  const [tags, setTags] = useState<{ value: string; label: string }[]>([]);
  const fetchtags = async () => {
    try {
      const response = await fetch("/api/tags");
      if (!response.ok) {
        throw new Error(`Chyba při načítání značek: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      const formattedTags = data.data.map((tag: any) => ({
        value: String(tag.id),
        label: tag.text,
      }));
  
      setTags(formattedTags);
    } catch (error) {
      console.error("Chyba při načítání značek:", error);
      setTags([]); // Nastavení prázdného seznamu při chybě
    }
  };
  
  useEffect(() => {
    fetchtags();
    console.log("Tags fetched", tags);
  }, []);
  return (
    <Drawer
      opened={state.opened}
      onClose={() => dispatch({ type: "SET_OPENED", opened: false })}
      padding="md"
      title="Filtrování firem"
      zIndex={1000}
      position="top"
    >
      <Grid w="100%">
        <Grid.Col span={isMobile ? 12 : isTablet ? 6 : 4}>
          <TextInput
            label="Název"
            value={state.filterName}
            onChange={(event) =>
              dispatch({
                type: "SET_NAME_FILTER",
                text: event.currentTarget.value,
              })
            }
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : isTablet ? 6 : 4}>
          <NumberInput
            label="IČO"
            value={state.filterTaxNum}
            onChange={(val) =>
              dispatch({
                type: "SET_TAX_FILTER",
                number: val === "" ? undefined : Number(val),
              })
            }
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : isTablet ? 6 : 4}>
          <TextInput
            label="Sídlo firmy (obec)"
            value={state.filterMunicipality}
            onChange={(event) =>
              dispatch({
                type: "SET_MUNICIPALITY_FILTER",
                text: event.currentTarget.value,
              })
            }
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : isTablet ? 6 : 4}>
          <Text size="sm">Aktivní</Text>
          <Button.Group>
            <Button
              onClick={() =>
                dispatch({ type: "SET_ACTIVE_FILTER", activity: true })
              }
              color={state.filterActive === true ? "blue" : "gray"}
            >
              Ano
            </Button>
            <Button
              onClick={() =>
                dispatch({ type: "SET_ACTIVE_FILTER", activity: false })
              }
              color={state.filterActive === false ? "blue" : "gray"}
            >
              Ne
            </Button>
            <Button
              onClick={() =>
                dispatch({ type: "SET_ACTIVE_FILTER", activity: undefined })
              }
              color={state.filterActive === undefined ? "blue" : "gray"}
            >
              Vše
            </Button>
          </Button.Group>
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : isTablet ? 6 : 4}>
        <MultiSelect
          comboboxProps={{ zIndex: 1000 }}
          label="Značky"
          data={tags}
          value={state.filterTags.map(String)}
          onChange={(selected) =>
            dispatch({ type: "SET_TAGS_FILTER", tags: selected.map(Number) })
          }
          placeholder="Vyberte značky"
          />
        </Grid.Col>
      </Grid>
      <Group my="sm">
        <ScrollArea></ScrollArea>
      </Group>
    </Drawer>
  );
};

const FrontLayout = ({ children }: Props) => {
  return (
    <FilterProvider>
      {children}
      <FilterDrawer />
    </FilterProvider>
  );
};

export default FrontLayout;
