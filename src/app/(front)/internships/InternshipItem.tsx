import React, { FC } from "react";
import { Paper, Title, Text, Box, Button } from "@mantine/core";
import { InternshipWithCompanyLocationSetUser } from "@/types/entities";
import styles from "./InternshipItem.module.css";
import { DateTime } from "@/components";
import { IconTrash } from "@tabler/icons-react";

type TInternshipItemProps = {
  internship: InternshipWithCompanyLocationSetUser;
  onClick: (internship: InternshipWithCompanyLocationSetUser) => void;
  onEditClick: (internship: InternshipWithCompanyLocationSetUser) => void;
  onDeleteClick: (internship: InternshipWithCompanyLocationSetUser) => void;
};

const InternshipItem: FC<TInternshipItemProps> = ({
  internship,
  onClick,
  onDeleteClick,
  onEditClick,
}) => {
  return (
    <Paper className={styles.container} shadow="xs" p="xl" mt="sm">
      <Title order={3} className={styles.title}>
        {internship.company.name + " (" + internship.set.year + ")"}
      </Title>
      <Text fw="700" className={styles["from-title"]}>
        Od
      </Text>
      <Text className={styles["from-property"]}>
        <DateTime date={internship.set.start} locale="cs" />
      </Text>
      <Text fw="700" className={styles["to-title"]}>
        Do
      </Text>
      <Text className={styles["to-property"]}>
        <DateTime date={internship.set.end} locale="cs" />
      </Text>
      <Text fw="700" className={styles["hours-title"]}>
        Hodiny
      </Text>
      <Text className={styles["hours-property"]}>
        {internship.set.hoursDaily}
      </Text>
      <Text fw="700" className={styles["days-title"]}>
        Dny
      </Text>
      <Text className={styles["days-property"]}>
        {internship.set.daysTotal}
      </Text>
      <Box className={styles.controls}>
        <Button onClick={(e) => onClick(internship)} size="xs" variant="default">
          Detail
        </Button>
        {!internship.set.editable ? (
          <Button
            size="xs"
            variant="default"
            onClick={(e) => onEditClick(internship)}
          >
            Editovat
          </Button>
        ) : null}
        {!internship.set.editable ? (
          <Button
            color="red"
            variant="default"
            size="xs"
            onClick={(e) => onDeleteClick(internship)}
            leftSection={<IconTrash />}
          >
            Odstranit
          </Button>
        ) : null}
      </Box>
    </Paper>
  );
};
export default InternshipItem;
