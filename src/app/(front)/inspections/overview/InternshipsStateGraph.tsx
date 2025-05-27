import React, { FC, useEffect, useState } from "react";
import { Table, Loader, Alert, Text } from "@mantine/core";

type InternshipStateSummary = {
  total: number;
  reserved: number;
  inspected: number;
};

type InternshipStateGraphProps = {
  setId: number | null;
};

const InternshipStateGraph: FC<InternshipStateGraphProps> = ({ setId }) => {
  const [data, setData] = useState<InternshipStateSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySet = setId ? `set=${encodeURIComponent(setId)}` : "";
        const queryActive = `active=true`;
        const queryString = [querySet, queryActive].filter(Boolean).join("&");

        const response = await fetch(`/api/graphs/state?${queryString}`);
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching internship state:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Alert color="red">{error.message}</Alert>;
  }

  return (
    <>
      <Text>{setId}</Text>
    </>
  );
};

export default InternshipStateGraph;
