"use client";

import React from "react";
import Input from "./Input";
import Dropdown, { useDropdown } from "../dropdown";
import DropdownTrigger from "../dropdown/DropdownTrigger";
import DropdownBody from "../dropdown/DropdownBody";
import { MdKeyboardArrowDown } from "react-icons/md";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

type SelectProps = React.ComponentProps<typeof Input> & {
  setValue: (value: string) => void;
  value: string;
};

const selectContext = React.createContext<{
  value: string | undefined;
  setValue: (value: string) => void;
}>({
  value: undefined,
  setValue: () => {},
});

export const useSelect = () => React.useContext(selectContext);

function Select({ children, setValue, className, ...props }: SelectProps) {
  const found = React.Children.toArray(children).find(
    (child) =>
      React.isValidElement(child) &&
      (child.props as OptionProps).value === props.value
  ) as React.ReactElement<OptionProps> | undefined;
  return (
    <Dropdown>
      <DropdownTrigger>
        <Input
          {...props}
          className={cn(className, "cursor-pointer")}
          readOnly
          value={found ? found.props.children : ""}
        >
          <SelectArrow />
        </Input>
      </DropdownTrigger>
      <DropdownBody className="w-full flex flex-col gap-2">
        <selectContext.Provider
          value={{
            value: props.value,
            setValue,
          }}
        >
          {children}
        </selectContext.Provider>
      </DropdownBody>
    </Dropdown>
  );
}

function SelectArrow() {
  const { isOpen } = useDropdown();
  return (
    <MotionArrow
      className="absolute right-1 top-1/2 bottom-0  text-2xl -translate-y-1/2"
      animate={{
        rotateZ: isOpen ? 180 : 0,
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    />
  );
}

const MotionArrow = motion.create(MdKeyboardArrowDown);

type OptionProps = {
  children: string;
  value: string;
};

export function Option({ children, value }: OptionProps) {
  const { setValue } = useSelect();
  const { close } = useDropdown();
  return (
    <div
      className="cursor-pointer hover:bg-background/50 rounded pl-4 py-2"
      onClick={() => {
        setValue(value);
        close();
      }}
    >
      {children}
    </div>
  );
}

export default Select;
