"use client";

import React from "react";
import { useDropdown } from ".";

function DropdownTrigger({ children }: React.PropsWithChildren) {
  const { toggle } = useDropdown();

  return <div onClick={toggle}>{children}</div>;
}

export default DropdownTrigger;
