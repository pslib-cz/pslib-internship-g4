import {
  Container,
  Timeline,
  TimelineItem,
  Title,
  Box,
  Text,
  Anchor,
} from "@mantine/core";
import Link from "next/link";
import styles from "./CreateInternshipSection.module.css";
import {
  IconGitBranch,
  IconGitPullRequest,
  IconGitCommit,
  IconMessageDots,
} from "@tabler/icons-react";

const CreateInternshipSection = () => {
  return (
    <Box className={styles.panel}>
      <Container>
        <Title order={2}>Založení praxe</Title>
      </Container>
    </Box>
  );
};

export default CreateInternshipSection;
