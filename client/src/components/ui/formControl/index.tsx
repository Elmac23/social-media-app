"use client";
import React, { useId } from "react";

const formControlContext = React.createContext<{ id: string; error?: string }>({
  id: "",
  error: undefined,
});

export const useFormControl = () => React.useContext(formControlContext);

export type FormControlProps = React.ComponentProps<"div"> & {
  error?: string;
};

function FormControl({ error, children, ...props }: FormControlProps) {
  const id = useId();
  return (
    <div {...props}>
      <formControlContext.Provider value={{ error, id }}>
        {children}
      </formControlContext.Provider>
    </div>
  );
}

export default FormControl;
