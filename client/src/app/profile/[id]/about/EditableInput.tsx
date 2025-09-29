"use client";

import Input from "@/components/ui/formControl/Input";
import Typography from "@/components/ui/Typography";
import React from "react";
import { useAboutField, UserEdit } from "./AboutFieldWrapper";

type EditableFieldProps = React.PropsWithChildren & {
  label: string;
  name: keyof UserEdit;
};

function EditableInput({ label, name }: EditableFieldProps) {
  const { value, setValue } = useAboutField();
  return (
    <div className="flex gap-4">
      <Typography>{label}</Typography>

      <Input
        size="small"
        name={name}
        value={value[name] || ""}
        onInput={(e) =>
          setValue({ ...value, [name]: (e.target as HTMLInputElement).value })
        }
      />
    </div>
  );
}

export default EditableInput;
