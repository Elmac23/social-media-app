import FullScreenImage from "@/components/fullScreenImage";
import Image from "next/image";
import React from "react";

type Props = {
  src: string;
  alt: string;
};

function GalleryPhoto({ src, alt }: Props) {
  return (
    <FullScreenImage imageUrl={src} alt={alt}>
      <Image
        src={src}
        alt={alt}
        width="400"
        height="400"
        className="rounded-md aspect-square object-cover w-full h-full"
      />
    </FullScreenImage>
  );
}

export default GalleryPhoto;
