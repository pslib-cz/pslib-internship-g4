import { useCallback } from "react";

export type TUseSessionStorage<T> = [
  () => T | undefined,
  (value: T) => void,
  () => void,
];

export const useSessionStorage = <T>(key: string): TUseSessionStorage<T> => {
  const loadSessionItem = useCallback((): T | undefined => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }, [key]);

  const setSessionItem = useCallback(
    (value: T): void => {
      try {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(error);
      }
    },
    [key],
  );

  const removeSessionItem = useCallback((): void => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  return [loadSessionItem, setSessionItem, removeSessionItem];
};
