"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Title, Box, Alert, Button, Group, Text } from "@mantine/core";
import { IconDownload, IconPrinter, IconPdf } from "@tabler/icons-react";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";

type ConclusionDownloadProps = {
  internshipId: string;
};

const ConclusionDownload: FC<ConclusionDownloadProps> = ({ internshipId }) => {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const [shouldGeneratePdf, setShouldGeneratePdf] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrintContentLoad = useCallback(() => {
    fetch(`/api/internships/${internshipId}/conclusion/print`)
      .then((response) => response.text())
      .then((data) => {
        setContent(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, [internshipId]);

  const handleDownloadPdf = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/internships/${internshipId}/conclusion/print`,
      );
      const data = await response.text();
      setContent(data);
      setShouldGeneratePdf(true);
    } catch (err) {
      if (err instanceof Error) setError(err);
    }
  }, [internshipId]);

  useEffect(() => {
    if (shouldGeneratePdf && contentRef.current) {
      const element = contentRef.current;

      const opt = {
        margin: 0.5,
        filename: "zaverecna-zprava.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
      };

      html2pdf().set(opt).from(element).save();
      setShouldGeneratePdf(false);
    }
  }, [shouldGeneratePdf, content]);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: "Závěrečná zpráva z praxe",
    removeAfterPrint: true,
  });

  return (
    <>
      <Title order={3}>Závěrečná zpráva z praxe</Title>
      <Text>Tento dokument obsahuje shrnutí praxe a hodnocení studenta.</Text>
      {error && <Alert color="red">{error.message}</Alert>}
      <Box>
        <Group mt="1em">
          <Button
            variant="filled"
            leftSection={<IconPrinter />}
            onClick={async () => {
              handlePrintContentLoad();
              handlePrint();
            }}
          >
            Tisk
          </Button>
          <Button
            variant="default"
            leftSection={<IconPdf />}
            onClick={handleDownloadPdf}
          >
            .pdf
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
