import { Container, Box, Grid, GridCol } from "@mantine/core";
import CompaniesPanel from "./CompaniesPanel";
import styles from "./CompaniesSection.module.css";

const CompaniesSection = () => {
  return (
    <Box className={styles.panel}>
      <Container>
        <CompaniesPanel />
      </Container>
    </Box>
  );
};

export default CompaniesSection;
