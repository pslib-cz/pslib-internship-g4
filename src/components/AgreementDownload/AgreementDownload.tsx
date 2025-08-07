"use client";

import { FC, useCallback, useRef, useState, useEffect } from "react";
import { Title, Box, Alert, Button, Group, Text } from "@mantine/core";
import { IconDownload, IconPrinter, IconPdf } from "@tabler/icons-react";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";

type AgreementDownloadProps = {
  internshipId: string;
};

const AgreementDownload: FC<AgreementDownloadProps> = ({ internshipId }) => {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const [shouldGeneratePdf, setShouldGeneratePdf] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/internships/${internshipId}/agreement`,
      );
      const data = await response.text();
      setContent(data);
      setShouldGeneratePdf(true); // signál pro useEffect
    } catch (err) {
      if (err instanceof Error) setError(err);
    }
  }, [internshipId]);

  useEffect(() => {
    if (shouldGeneratePdf && contentRef.current) {
      const element = contentRef.current;

      const opt = {
        margin: 0.5,
        filename: "smlouva-o-praxi.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
      };

      html2pdf().set(opt).from(element).save();
      setShouldGeneratePdf(false);
    }
  }, [shouldGeneratePdf, content]);

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

  const handlePrint = useReactToPrint({
    content: useCallback(() => contentRef.current, []),
    documentTitle: "Smlouva o praxi",
    removeAfterPrint: true,
  });

  return (
    <>
      <Title order={3}>Smlouva o praxi</Title>
      <Text>
        Pokud ve vygenerované smlouvě chybí některé Vaše osobní údaje, můžete si
        je nastavit ve svém profilu pod ikonkou na pravé straně záhlaví
        aplikace.
      </Text>
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
      {/* Skrytý obsah pro tisk a PDF */}
      <div style={{ height: 0, overflow: "hidden", width: 0 }}>
        <div ref={contentRef} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </>
  );
};

export default AgreementDownload;
