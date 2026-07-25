import React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import FullScreenImage from "../fullScreenImage";

const PostImage = React.memo(function PostImage({
  imageId,
  className,
  imageUrl,
}: {
  imageId?: string;
  imageUrl?: string;
  className?: string;
}) {
  const imageUrlServer = `${process.env.NEXT_PUBLIC_SERVER_URL_API || "http://localhost:3001/api"}/files/${imageId}`;

  return (
    <FullScreenImage imageUrl={imageUrl || imageUrlServer} alt="post">
      <Image
        width={1000}
        height={500}
        src={imageUrl || imageUrlServer}
        alt="post"
        className={cn(
          "object-cover block rounded-lg mb-4 max-w-[100%] max-h-[500px]",
          className,
        )}
      />
    </FullScreenImage>
  );
});

export default PostImage;
