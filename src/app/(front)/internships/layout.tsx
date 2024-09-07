"use client";

import React, { useContext } from "react";
import isTeacher from "@/hocs/isTeacherClient";

type Props = {
  children?: React.ReactNode;
};

const FrontLayout = ({ children }: Props) => {
  return <>{children}</>;
};

export default isTeacher(FrontLayout);
