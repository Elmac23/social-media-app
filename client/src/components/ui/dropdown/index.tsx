"use client";

import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/lib/cn";
import React from "react";

type DropdownProps = React.ComponentProps<"div"> & {
  closeOnHoverExit?: boolean;
  isOpen?: boolean;
};

const dropdownContext = React.createContext({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
  closeOnHoverExit: true,
});

export const useDropdown = () => React.useContext(dropdownContext);

function Dropdown({
  className,
  closeOnHoverExit,
  isOpen,
  ...props
}: DropdownProps) {
  const { setFalse, setTrue, value, toggle } = useToggle();
  return (
    <dropdownContext.Provider
      value={{
        closeOnHoverExit: closeOnHoverExit || false,
        isOpen: value || (isOpen === undefined ? false : isOpen),
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
