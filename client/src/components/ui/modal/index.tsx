"use client";

import React from "react";
import Card from "../Card";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
} & React.PropsWithChildren;

function Modal({ isOpen, onClose, children, className }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-2xl grid place-items-center z-50"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <Card
            className={cn("w-2xl min-h-48", className)}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
