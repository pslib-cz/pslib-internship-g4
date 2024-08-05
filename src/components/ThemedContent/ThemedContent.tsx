import { useComputedColorScheme } from "@mantine/core";
import React from "react";

type ThemedContentProps = {
    light: React.ReactNode;
    dark: React.ReactNode;
}

export const ThemedContent: React.FC<ThemedContentProps> = ({light, dark}) => {
  const computedColorScheme = useComputedColorScheme("light");
  return (
    <>
      {computedColorScheme === "light" ? (
        light
      ) : (
        dark
      )}
    </>
  );
};

export default ThemedContent;
