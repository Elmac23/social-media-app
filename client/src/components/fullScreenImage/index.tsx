"use client";

import { useToggle } from "@/hooks/useToggle";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React from "react";

const MotionImage = motion.create(Image);

type FullScreenImageProps = React.PropsWithChildren & {
  imageUrl: string;
  alt: string;
};

function FullScreenImage({ imageUrl, alt, children }: FullScreenImageProps) {
  const { value, setFalse, setTrue } = useToggle();
  return (
    <div>
      <div onClick={setTrue} className="cursor-pointer">
        {children}
      </div>
      <AnimatePresence>
        {value && (
          <motion.div
            onClick={setFalse}
            className="fixed z-100 inset-0 grid place-items-center bg-black/90 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MotionImage
              src={imageUrl}
              alt={alt}
              width={1000}
              height={1000}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[90vh] max-w-[90vw] block object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FullScreenImage;
