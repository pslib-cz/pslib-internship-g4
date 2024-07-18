import { Container, Box, Grid, GridCol } from "@mantine/core";
import CompaniesPanel from "./CompaniesPanel";
import styles from "./CompaniesSection.module.css";

const CompaniesSection = () => {
  return (
    <Box className={styles.panel}>
      <Container>
        <Grid>
          <GridCol span={{ base: 12, sm: 12, lg: 9 }}>
            <CompaniesPanel />
          </GridCol>
          <GridCol span={{ base: 12, sm: 0, lg: 3 }}>X</GridCol>
        </Grid>
      </Container>
    </Box>
  );
};

export default CompaniesSection;
