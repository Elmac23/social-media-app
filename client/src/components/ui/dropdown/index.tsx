"use client";

import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/lib/cn";
import React from "react";

const dropdownContext = React.createContext({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export const useDropdown = () => React.useContext(dropdownContext);

function Dropdown({ className, ...props }: React.ComponentProps<"div">) {
  const { setFalse, setTrue, value, toggle } = useToggle();
  return (
    <dropdownContext.Provider
      value={{
        isOpen: value,
        open: setTrue,
        close: setFalse,
        toggle: toggle,
      }}
    >
      <div className={cn(className, "relative")} {...props} />
    </dropdownContext.Provider>
  );
}

export default Dropdown;
