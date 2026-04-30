"use client";

import { useMounted } from "@/hooks/useMounted";
import React, { useEffect } from "react";
import { useDropdown } from ".";
import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";

function DropdownBody({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
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
          className={cn(
            "bg-background-lighter shadow-lg border-1 border-border p-4 rounded-lg fixed lg:absolute z-50 top-30 bottom-30 left-10 right-10 lg:inset-auto",
            className,
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onMouseLeave={handleMouseLeave}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DropdownBody;
