"use client";

import { useTheme } from "next-themes";
import React from "react";
import Select, { Option } from "./formControl/Select";

function ThemeSelect(): React.ReactNode {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Select value={theme ?? ""} setValue={(v: string) => setTheme(v)}>
        <Option value="blue">Classic Dark</Option>
        <Option value="blue-light">Classic Light</Option>
        <Option value="green">Green Dark</Option>
        <Option value="green-light">Green Light</Option>
        <Option value="purple">Purple Dark</Option>
        <Option value="purple-light">Purple Light</Option>
        <Option value="amber">Amber Dark</Option>
        <Option value="amber-light">Amber Light</Option>
        <Option value="crimson">Crimson Dark</Option>
        <Option value="cyberpunk">Cyberpunk</Option>
        <Option value="paper">Paper Light</Option>
        <Option value="candy">Candy Light</Option>
      </Select>
    </>
  );
}

export default ThemeSelect;
