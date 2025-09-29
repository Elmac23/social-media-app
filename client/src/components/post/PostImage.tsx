import React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import FullScreenImage from "../fullScreenImage";

function PostImage({
  imageUrl,
  className,
}: {
  imageUrl: string;
  className?: string;
}) {
  return (
    <FullScreenImage imageUrl={imageUrl} alt="post">
      <Image
        width="1000"
        height="500"
        src={imageUrl}
        alt="post"
        className={cn(
          "object-cover block rounded-lg mb-4 max-w-[100%] max-h-[500px]",
          className
        )}
      />
    </FullScreenImage>
  );
}

export default PostImage;
