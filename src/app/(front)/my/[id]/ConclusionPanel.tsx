import React, { FC, use, useEffect, useState, useCallback } from "react";
import {
  Alert,
  Card,
  Group,
  Text,
  Title,
  LoadingOverlay,
  Button,
  Radio,
  Box,
  TextInput,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  InternshipFullRecord,
  InternshipWithCompanyLocationSetUser,
} from "@/types/entities";

enum DisplayMode {
  DISPLAY,
  EDIT,
}

type ConclusionPanelProps = {
  internship: InternshipFullRecord | InternshipWithCompanyLocationSetUser;
  reloadInternshipCallback: () => void;
};

const ConclusionDisplay: FC<{
  setMode: (mode: DisplayMode) => void;
  text: string | null;
}> = ({ setMode, text }) => {
  return (
    <>
      {text ? (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      ) : (
        <Text>Závěrečná zpráva nebyla zadána.</Text>
      )}
      <Group pt="sm">
        <Button onClick={() => setMode(DisplayMode.EDIT)}>Upravit</Button>
      </Group>
    </>
  );
};

const ConclusionPanel: FC<ConclusionPanelProps> = ({
  internship,
  reloadInternshipCallback,
}) => {
  const [mode, setMode] = useState(DisplayMode.DISPLAY);
  const switchMode = (mode: DisplayMode) => {
    setMode(mode);
  };

  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Závěrečná zpráva</Title>
      {mode === DisplayMode.DISPLAY && (
        <ConclusionDisplay text={internship.conclusion} setMode={switchMode} />
      )}
    </Card>
  );
};

export default ConclusionPanel;
