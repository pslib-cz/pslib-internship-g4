"use client";

import { clarity } from "react-microsoft-clarity";

clarity.init(process.env.CLARITY_ID ?? "");
if (clarity.hasStarted()) {
  clarity.identify("USER_ID", { userProperty: "value" });
}

const ClarityAnalytics = () => {
  return null;
};

export default ClarityAnalytics;
