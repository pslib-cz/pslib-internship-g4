"use client";

import React, { useContext } from "react";
import {
  Group,
  Drawer,
  ScrollArea,
  Text,
  Grid,
  Button,
  TextInput,
  NumberInput,
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
