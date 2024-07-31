"use client";

import React, { useState, useEffect } from "react";
import { Box, Title, Anchor } from "@mantine/core";
import Link from "next/link";
import { TextWithAuthor } from "@/types/entities";

type TextsArticleProps = {
  text: TextWithAuthor;
};

const TextsArticle: React.FC<TextsArticleProps> = ({ text }) => {
  return (
    <article>
      <header>
        <Title order={2}>{text.title}</Title>
      </header>
      <Box dangerouslySetInnerHTML={{ __html: text.content ?? "" }} />
      <footer>
        <Anchor component={Link} href={`/texts?author=${text.creator.id}`}>
          {text.creator.givenName} {text.creator.surname}
        </Anchor>
      </footer>
    </article>
  );
};

export default TextsArticle;
