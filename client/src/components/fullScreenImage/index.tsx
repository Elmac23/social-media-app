"use client";

import { useToggle } from "@/hooks/useToggle";
import { motion } from "motion/react";
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
      <motion.div
        onClick={setFalse}
        layout
        className="fixed  z-100 bg-black/90 inset-0 grid place-items-center backdrop-blur-lg"
        initial={{ opacity: 0, visibility: "hidden" }}
        animate={
          value
            ? {
                opacity: 1,
                visibility: "visible",
              }
            : { opacity: 0, visibility: "hidden" }
        }
      >
        <MotionImage
          src={imageUrl}
          alt={alt}
          width="1000"
          height="1000"
          className="max-h-[90vh] max-w-[90vw] block object-contain"
        />
      </motion.div>
    </div>
  );
}

export default FullScreenImage;
