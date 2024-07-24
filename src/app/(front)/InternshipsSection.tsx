import {
  Container,
  Box,
  Grid,
  GridCol,
  Title,
  Text,
  Anchor,
} from "@mantine/core";
import Link from "next/link";
import styles from "./InternshipsSection.module.css";

const InternshipsSection = () => {
  return (
    <Box className={styles.panel}>
      <Container>
        <Title order={2}>Praxe</Title>
      </Container>
    </Box>
  );
};

export default InternshipsSection;
