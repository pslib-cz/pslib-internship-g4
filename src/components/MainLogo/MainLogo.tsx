import { Group } from "@mantine/core";
import InternshipLogoLight from "@/assets/pslib_interns.svg";
import InternshipLogoDark from "@/assets/pslib_interns_dark.svg";
import ThemedContent from "../ThemedContent/ThemedContent";

export const MainLogo: React.FC = () => {
  return (
    <Group>
      <ThemedContent
        light={<InternshipLogoLight />}
        dark={<InternshipLogoDark />}
      />
    </Group>
  );
};

export default MainLogo;
