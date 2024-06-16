"use client";

import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  ActionIconProps,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

export const ThemeIcon: React.FC<ActionIconProps> = ({ ...rest }) => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      variant="default"
      aria-label="Toggle color scheme"
      title="Přepnutí barevného schématu"
      size="lg"
      {...rest}
    >
      {computedColorScheme === "dark" ? (
        <IconSun stroke={1} />
      ) : (
        <IconMoon stroke={1} />
      )}
    </ActionIcon>
  );
};

export default ThemeIcon;
