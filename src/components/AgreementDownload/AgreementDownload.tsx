"use client";

import { FC, useCallback, useRef, useState } from "react";
import { Title, Box, Alert, Button, Group, Text } from "@mantine/core";
import { IconDownload, IconPrinter } from "@tabler/icons-react";
import { useReactToPrint } from "react-to-print";

type AgreementDownloadProps = {
  internshipId: string;
};

const AgreementDownload: FC<AgreementDownloadProps> = ({ internshipId }) => {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const handleOnBeforeGetContent = useCallback(() => {
    fetch(`/api/internships/${internshipId}/agreement`)
      .then((response) => response.text())
      .then((data) => {
        setContent(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, [internshipId]);
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: useCallback(() => contentRef.current, []),
    documentTitle: "Smlouva o praxi",
    removeAfterPrint: true,
  });
  return (
    <>
      <Title order={3}>Smlouva o praxi</Title>
      <Text>Pokud ve vygenerované smlouvě chybí některé Vaše osobní údaje, můžete si je nastavit ve svém profilu pod ikonkou na pravé straně záhlaví aplikace.</Text>
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
                `/api/internships/${internshipId}/agreement`,
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

export default AgreementDownload;
