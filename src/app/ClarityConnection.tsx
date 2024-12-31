"use client";

import Clarity from "@microsoft/clarity";

const projectId = process.env.CLARITY_ID ?? "";

Clarity.init(projectId);
Clarity.identify(
  "custom-id",
  "custom-session-id",
  "custom-page-id",
  "friendly-name",
);

const ClarityConnection = () => {
  return null;
};

export default ClarityConnection;
