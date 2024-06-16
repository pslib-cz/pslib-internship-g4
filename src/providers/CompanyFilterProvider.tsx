import React, { createContext, useState } from "react";

type FilterState = {
  opened: boolean;
  close: () => void;
  open: () => void;
  filterName: string;
  setFilterName: (name: string) => void;
  filterTaxNum: number | undefined;
  setFilterTaxNum: (tax: number | undefined) => void;
  filterActive: boolean | undefined;
  setFilterActive: (active: boolean | undefined) => void;
  filterMunicipality: string;
  setFilterMunicipality: (municipality: string) => void;
  orderBy: string;
  setOrderBy: (orderBy: string) => void;
};

export const FilterContext = createContext<FilterState>({
  opened: false,
  close: () => {},
  open: () => {},
  filterName: "",
  setFilterName: () => {},
  filterTaxNum: undefined,
  setFilterTaxNum: () => {},
  filterActive: undefined,
  setFilterActive: () => {},
  filterMunicipality: "",
  setFilterMunicipality: () => {},
  orderBy: "name",
  setOrderBy: () => {},
});

export const FilterProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const [filterName, setFilterName] = useState<string>("");
  const [filterTaxNum, setFilterTaxNum] = useState<number | undefined>(
    undefined,
  );
  const [filterActive, setFilterActive] = useState<boolean | undefined>(true);
  const [filterMunicipality, setFilterMunicipality] = useState<string>("");
  const [orderBy, setOrderBy] = useState("name");
  const initialState: FilterState = {
    opened: opened,
    close: () => setOpened(false),
    open: () => setOpened(true),
    filterName: filterName,
    setFilterName: setFilterName,
    filterTaxNum: filterTaxNum,
    setFilterTaxNum: setFilterTaxNum,
    filterActive: filterActive,
    setFilterActive: setFilterActive,
    filterMunicipality: filterMunicipality,
    setFilterMunicipality: setFilterMunicipality,
    orderBy: orderBy,
    setOrderBy: setOrderBy,
  };

  return (
    <FilterContext.Provider value={initialState}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;