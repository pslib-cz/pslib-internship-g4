"use client";

import React, {
  useState,
  useEffect,
  Suspense,
  FC,
  useCallback,
  useRef,
} from "react";
import {
  Title,
  Box,
  Text,
  Alert,
  Breadcrumbs,
  Anchor,
  LoadingOverlay,
  Container,
  SimpleGrid,
  Card,
  Button,
  Group,
} from "@mantine/core";
import { IconDownload, IconPrinter } from "@tabler/icons-react";
import {
  InternshipWithCompanyLocationSetUser,
  InternshipFullRecord,
} from "@/types/entities";
import DateTime from "@/components/DateTime/DateTime";
import Link from "next/link";
import { getInternshipKindLabel } from "@/data/lists";
import LocationPanel from "./LocationPanel";
import DiarySection from "./DiarySection";
import { useReactToPrint } from "react-to-print";

const StudentDisplay: FC<
  InternshipFullRecord | InternshipWithCompanyLocationSetUser
> = (internship) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Student</Title>
      <Text fw={700}>Jméno a příjmení</Text>
      <Text>
        {internship.user.givenName} {internship.user.surname}
      </Text>
      <Text fw={700}>Email</Text>
      <Text>{internship.user.email}</Text>
      <Text fw={700}>Třída</Text>
      <Text>{internship.classname}</Text>
    </Card>
  );
};

const SetDisplay: FC<
  InternshipFullRecord | InternshipWithCompanyLocationSetUser
> = (internship) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Sada</Title>
      <Text fw={700}>Termín</Text>
      <Text>
        <DateTime date={internship.set.start} locale="cs" /> &ndash;{" "}
        <DateTime date={internship.set.end} locale="cs" />
      </Text>
      <Text fw={700}>Počet dní</Text>
      <Text>{internship.set.daysTotal}</Text>
      <Text fw={700}>Počet hodin denně</Text>
      <Text>{internship.set.hoursDaily}</Text>
      <Text fw={700}>Druh</Text>
      <Text>{internship.set.continuous ? "Průběžná" : "Souvislá"}</Text>
      <Text fw={700}>Rok</Text>
      <Text>{internship.set.year}</Text>
    </Card>
  );
};

const CompanyDisplay: FC<
  InternshipFullRecord | InternshipWithCompanyLocationSetUser
> = (internship) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Firma</Title>
      <Text fw={700}>Název</Text>
      <Text>{internship.company.name}</Text>
      <Text fw={700}>IČO</Text>
      <Text>{internship.company.companyIdentificationNumber ?? "není"}</Text>
      <Text fw={700}>Druh praxe</Text>
      <Text>{getInternshipKindLabel(String(internship.kind))}</Text>
    </Card>
  );
};

const DescriptionDisplay: FC<
  InternshipFullRecord | InternshipWithCompanyLocationSetUser
> = (internship) => {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={2}>Textové informace</Title>
      <Text fw={700}>Popis práce</Text>
      <Text>
        <Box
          dangerouslySetInnerHTML={{
            __html: internship.jobDescription ?? "není",
          }}
        />
      </Text>
      <Text fw={700}>Další informace</Text>
      <Text>
        <Box
          dangerouslySetInnerHTML={{
            __html: internship.additionalInfo ?? "není",
          }}
        />
      </Text>
      <Text fw={700}>Doplňky ke smlouvě</Text>
      <Text>
        <Box
          dangerouslySetInnerHTML={{
            __html: internship.appendixText ?? "není",
          }}
        />
      </Text>
    </Card>
  );
};

const FilesDisplay: FC<
  InternshipFullRecord | InternshipWithCompanyLocationSetUser
> = (internship) => {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const handleOnBeforeGetContent = useCallback(() => {
    fetch(`/api/internships/${internship.id}/agreement`)
      .then((response) => response.text())
      .then((data) => {
        setContent(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, [internship]);
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: useCallback(() => contentRef.current, []),
    documentTitle: "Smlouva o praxi",
    removeAfterPrint: true,
  });
  return (
    <>
      <Card shadow="sm" padding="lg">
        <Title order={2}>Smlouva o praxi</Title>
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
                  `/api/internships/${internship.id}/agreement`,
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
      </Card>
    </>
  );
};

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const loadData = useCallback(() => {
    fetch(`/api/internships/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          setData(null);
          setError("Došlo k chybě při získávání dat.");
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {});
  }, []);
  const [data, setData] = useState<InternshipWithCompanyLocationSetUser | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    loadData();
  }, [loadData]);

  if (error) {
    return <Alert color="red">{error}</Alert>;
  }
  if (!data) {
    return <LoadingOverlay />;
  }
  return (
    <>
      <Breadcrumbs separatorMargin="md" m="xs">
        <Anchor component={Link} href="/">
          Titulní stránka
        </Anchor>
        <Anchor component={Link} href="/my">
          Moje praxe
        </Anchor>
        <Text>Detail</Text>
      </Breadcrumbs>
      <Container>
        {error ? (
          <Alert color="red">{error}</Alert>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            <Suspense fallback={<LoadingOverlay />}>
              <StudentDisplay {...data} />
            </Suspense>
            <Suspense fallback={<LoadingOverlay />}>
              <SetDisplay {...data} />
            </Suspense>
            <Suspense fallback={<LoadingOverlay />}>
              <CompanyDisplay {...data} />
            </Suspense>
            <Suspense fallback={<LoadingOverlay />}>
              <LocationPanel
                internship={data}
                reloadInternshipCallback={loadData}
              />
            </Suspense>
            <Suspense fallback={<LoadingOverlay />}>
              <DescriptionDisplay {...data} />
            </Suspense>
            <Suspense fallback={<LoadingOverlay />}>
              <FilesDisplay {...data} />
            </Suspense>
          </SimpleGrid>
        )}
        <Suspense fallback={<LoadingOverlay />}>
          <DiarySection id={id} editable={data.set.active} />
        </Suspense>
      </Container>
    </>
  );
};
export default Page;
