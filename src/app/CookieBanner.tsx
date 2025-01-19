"use client";

import { Button, CloseButton, Group, Paper, Text } from "@mantine/core";
import { useState, useEffect } from "react";

export const CookiesBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Zjistíme, zda uživatel již vyjádřil souhlas
    const consentGiven = document.cookie.includes("analytics_consent=true");
    if (!consentGiven) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    document.cookie = "analytics_consent=true; path=/; max-age=31536000"; // 1 rok
    setVisible(false);
  };

  const handlePreferences = () => {
    alert("Zde můžete přidat preference cookies.");
  };

  return (
    visible && (
      <Paper withBorder p="lg" radius="md" shadow="md" style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
        <Group mb="xs">
          <Text size="md">
            Použití cookies
          </Text>
          <CloseButton onClick={() => setVisible(false)} />
        </Group>
        <Text c="dimmed" size="xs">
          Tento web používá cookies ke zlepšení uživatelského zážitku. 
        </Text>
        <Group mt="sm">
          <Button variant="outline" size="xs" onClick={handleAccept}>
            Přijmout vše
          </Button>
        </Group>
      </Paper>
    )
  );
};

export default CookiesBanner;