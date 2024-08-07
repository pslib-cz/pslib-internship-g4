import React, { createContext, useContext, useReducer } from "react";

export type ReservationState = {
  opened: boolean;
  internshipId: string | null;
  locationId: number | null;
};

type ReservationAction =
  | { type: "SET_OPENED"; opened: boolean } 
  | { type: "SET_INTERNSHIP_ID"; id: string | null }
  | { type: "SET_LOCATION_ID"; id: number | null }

const reducer = (state: ReservationState, action: ReservationAction): ReservationState => {
  switch (action.type) {
    case "SET_OPENED":
      return { ...state, opened: action.opened };
    case "SET_INTERNSHIP_ID":
      return { ...state, internshipId: action.id || null };
    case "SET_LOCATION_ID":
        return { ...state, locationId: action.id || null };
    default:
      return state;
  }
};

const initialState: ReservationState = {
  opened: false,
  internshipId: null,
  locationId: null,
};

export const ReservationContext = createContext<
  [ReservationState, React.Dispatch<ReservationAction>]
>([initialState, () => {}]);
export const useFeastContext = () => useContext(ReservationContext);

export const ReservationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const state = useReducer(reducer, initialState);
  return (
    <ReservationContext.Provider value={state}>{children}</ReservationContext.Provider>
  );
};

export default ReservationContext;
