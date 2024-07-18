import React, { createContext, useState, useContext, useReducer } from "react";

export type FilterState = {
  opened: boolean;
  filterName: string;
  filterTaxNum: number | undefined;
  filterActive: boolean | undefined;
  filterTags: number[];
  filterMunicipality: string;
};

type FilterAction =
  | { type: "SET_OPENED"; opened: boolean }
  | { type: "SET_NAME_FILTER"; text: string | undefined }
  | { type: "SET_TAX_FILTER"; number: number | undefined }
  | { type: "SET_ACTIVE_FILTER"; activity: boolean | undefined }
  | { type: "SET_MUNICIPALITY_FILTER"; text: string | undefined }
  | { type: "SET_COUNTRY_FILTER"; text: string | undefined }
  | { type: "SET_TAGS_FILTER"; tags: number[] }
  | { type: "ADD_TAGS_FILTER"; tag: number }
  | { type: "REMOVE_TAGS_FILTER"; tag: number }
  | { type: "SWITCH_TAGS_FILTER"; tag: number }
  | { type: "RESET_FILTER" };

const reducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case "SET_OPENED":
      return { ...state, opened: action.opened };
    case "SET_NAME_FILTER":
      return { ...state, filterName: action.text || "" };
    case "SET_TAX_FILTER":
      return {
        ...state,
        filterTaxNum: action.number ? Number(action.number) : undefined,
      };
    case "SET_ACTIVE_FILTER":
      return { ...state, filterActive: action.activity };
    case "SET_MUNICIPALITY_FILTER":
      return { ...state, filterMunicipality: action.text || "" };
    case "SET_COUNTRY_FILTER":
      return state;
    case "SET_TAGS_FILTER":
      return { ...state, filterTags: action.tags };
    case "ADD_TAGS_FILTER":
      return { ...state, filterTags: [...state.filterTags, action.tag] };
    case "REMOVE_TAGS_FILTER":
      return {
        ...state,
        filterTags: state.filterTags.filter((tag) => tag !== action.tag),
      };
    case "SWITCH_TAGS_FILTER":
      return state.filterTags.includes(action.tag)
        ? {
            ...state,
            filterTags: state.filterTags.filter((tag) => tag !== action.tag),
          }
        : { ...state, filterTags: [...state.filterTags, action.tag] };
    case "RESET_FILTER":
      return {
        ...state,
        filterName: "",
        filterTaxNum: undefined,
        filterActive: undefined,
        filterTags: [],
        filterMunicipality: "",
      };
    default:
      return state;
  }
};

const initialState: FilterState = {
  opened: false,
  filterName: "",
  filterTaxNum: undefined,
  filterActive: undefined,
  filterTags: [],
  filterMunicipality: "",
};

export const FilterContext = createContext<
  [FilterState, React.Dispatch<FilterAction>]
>([initialState, () => {}]);
export const useFeastContext = () => useContext(FilterContext);

export const FilterProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const state = useReducer(reducer, initialState);
  return (
    <FilterContext.Provider value={state}>{children}</FilterContext.Provider>
  );
};

export default FilterContext;
