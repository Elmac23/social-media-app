import React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export type AvatarProps = {
  url: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

function Avatar({ className, url, alt, size = "md" }: AvatarProps) {
  return (
    <Image
      src={url}
      alt={alt}
      width={getSize(size)}
      height={getSize(size)}
      className={cn("rounded-full aspect-square object-cover", className)}
    />
  );
}

function getSize(size: AvatarProps["size"]) {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };
  if (!size) return sizes.md;
  return sizes[size];
}

export default Avatar;
