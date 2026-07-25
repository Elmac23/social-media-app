"use client";

import React from "react";
import { MdImage } from "react-icons/md";
import Button from "../Button";
import { useTranslations } from "next-intl";

type FileInputProps = {
  selectedImage: File | null;
  setSelectedImage: (file: File | null) => void;
};

function FileInput({ selectedImage, setSelectedImage }: FileInputProps) {
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const t = useTranslations("UserProfile.posts");

  return (
    <>
      <Button
        icon={<MdImage />}
        type="button"
        onClick={() => imageInputRef.current?.click()}
      >
        {selectedImage ? t("changeImage") : t("addImage")}
      </Button>

      <input
        className="hidden"
        ref={imageInputRef}
        value={""}
        type="file"
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];

          if (file) {
            setSelectedImage(file);
          } else {
            setSelectedImage(null);
          }
        }}
      />
    </>
  );
}

export default FileInput;
