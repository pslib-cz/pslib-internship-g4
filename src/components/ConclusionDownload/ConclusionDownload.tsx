"use client";

import { FC, useCallback, useRef, useState } from "react";
import { Title, Box, Alert, Button, Group, Text } from "@mantine/core";
import { IconDownload, IconPrinter } from "@tabler/icons-react";
import { useReactToPrint } from "react-to-print";

type ConclusionDownloadProps = {
  internshipId: string;
};

const ConclusionDownload: FC<ConclusionDownloadProps> = ({ internshipId }) => {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleOnBeforeGetContent = useCallback(() => {
    fetch(`/api/internships/${internshipId}/conclusion/print`)
      .then((response) => response.text())
      .then((data) => {
        setContent(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, [internshipId]);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: "Závěrečná zpráva z praxe",
    removeAfterPrint: true,
  });

  return (
    <>
      {error && <Alert color="red">{error.message}</Alert>}
      <Box>
        <Group mt="1em">
          <Button
            variant="filled"
            leftSection={<IconPrinter />}
            onClick={async () => {
              handleOnBeforeGetContent();
              handlePrint();
            }}
          >
            Tisk
          </Button>
          <Button
            leftSection={<IconDownload />}
            onClick={(e) => {
              e.preventDefault();
              window.open(
                `/api/internships/${internshipId}/conclusion/print`,
                "_blank",
              );
            }}
            variant="default"
          >
            .html
          </Button>
        </Group>
      </Box>
      <div style={{ height: 0, overflow: "hidden", width: 0 }}>
        <div
          ref={contentRef}
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
      </div>
    </>
  );
};

export default ConclusionDownload;
