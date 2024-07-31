"use client";

import React, { useState, useEffect } from "react";
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
import { TextWithAuthor } from "@/types/entities";
import styles from "./TextsSection.module.css";
import TextArticle from "./TextArticle";

const TextsSection = () => {
  const [texts, setTexts] = useState<TextWithAuthor[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/texts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Nepodařilo se načíst texty");
      })
      .then((data) => setTexts(data.data))
      .catch((error) => setError(error.message));
  }, []);
  return (
    <Box className={styles.panel}>
      <Container>
        {texts && (
          <Grid>
            {texts.map((text) => (
              <TextArticle key={text.id} text={text} />
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default TextsSection;
