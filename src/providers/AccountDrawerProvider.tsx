"use client";

import React, { createContext, useState } from "react";

type AccountDrawerState = {
  opened: boolean;
  close: () => void;
  open: () => void;
};

export const AccountDrawerContext = createContext<AccountDrawerState>({
  opened: false,
  close: () => {},
  open: () => {},
});

export const AccountDrawerProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const initialState: AccountDrawerState = {
    opened: opened,
    close: () => setOpened(false),
    open: () => setOpened(true),
  };
  return (
    <AccountDrawerContext.Provider value={initialState}>
      {children}
    </AccountDrawerContext.Provider>
  );
};

export default AccountDrawerProvider;
