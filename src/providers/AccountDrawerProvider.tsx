"use client";

import React, { createContext, useState, useEffect } from "react";

type AccountDrawerState = {
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  pageSizeOptions: number[];
  opened: boolean;
  close: () => void;
  open: () => void;
};

export const AccountDrawerContext = createContext<AccountDrawerState>({
  pageSize: 10,
  setPageSize: () => {},
  pageSizeOptions: [10, 20, 50, 100, 200],
  opened: false,
  close: () => {},
  open: () => {},
});

export const AccountDrawerProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  let storedPageSize =
    typeof window !== "undefined" ? localStorage.getItem("pageSize") : null;
  const [opened, setOpened] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(
    storedPageSize ? parseInt(storedPageSize) : 10,
  );
  useEffect(() => {
    if (pageSize !== null && typeof window !== "undefined") {
      localStorage.setItem("pageSize", pageSize.toString());
    }
  }, [pageSize]);
  const initialState: AccountDrawerState = {
    pageSize: pageSize,
    setPageSize: setPageSize,
    pageSizeOptions: [10, 20, 50, 100, 200],
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
