import { Group, useComputedColorScheme } from "@mantine/core";
import InternshipLogoLight from "@/assets/pslib_interns.svg";
import InternshipLogoDark from "@/assets/pslib_interns_dark.svg";

export const MainLogo: React.FC = () => {
  const computedColorScheme = useComputedColorScheme("light");
  return (
    <Group>
      {computedColorScheme === "light" ? (
        <InternshipLogoLight />
      ) : (
        <InternshipLogoDark />
      )}
    </Group>
  );
};

export default MainLogo;
