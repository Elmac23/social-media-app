"use client";

import { useMounted } from "@/hooks/useMounted";
import React, { useEffect } from "react";
import { useDropdown } from ".";
import Card from "../Card";
import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";

function DropdownBody({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  const isMounted = useMounted();
  const { isOpen, close, closeOnHoverExit } = useDropdown();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [close]);

  const handleMouseLeave = () => {
    if (closeOnHoverExit) {
      close();
    }
  };

  if (!isMounted) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          className="relative z-50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onMouseLeave={handleMouseLeave}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <Card className={cn(className, "absolute z-50")} {...props} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DropdownBody;
