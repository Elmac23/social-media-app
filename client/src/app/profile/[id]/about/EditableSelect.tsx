"use client";

import Typography from "@/components/ui/Typography";
import React from "react";
import { useAboutField, UserEdit } from "./AboutFieldWrapper";
import Select from "@/components/ui/formControl/Select";

type EditableFieldProps = React.PropsWithChildren & {
  label: string;
  name: keyof UserEdit;
};

function EditableSelect({ label, name, children }: EditableFieldProps) {
  const { value, setValue } = useAboutField();
  return (
    <div className="flex gap-4">
      <Typography>{label}</Typography>
      <Select
        size="small"
        value={value[name] || ""}
        setValue={(val) => setValue({ ...value, [name]: val })}
      >
        {children}
      </Select>
    </div>
  );
}

export default EditableSelect;
