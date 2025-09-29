import React from "react";
import Typography from "../Typography";
import { useFormControl } from ".";

function FormError({ children }: React.PropsWithChildren) {
  const { error } = useFormControl();
  if (!error) return null;
  return (
    <Typography size="sm" className="text-red-500 mt-2">
      {error}
      {children}
    </Typography>
  );
}

export default FormError;
