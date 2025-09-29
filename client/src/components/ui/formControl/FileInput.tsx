"use client";

import React from "react";
import { MdImage } from "react-icons/md";
import Button from "../Button";

type FileInputProps = {
  selectedImage: File | null;
  setSelectedImage: (file: File | null) => void;
};

function FileInput({ selectedImage, setSelectedImage }: FileInputProps) {
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        icon={<MdImage />}
        type="button"
        onClick={() => imageInputRef.current?.click()}
      >
        {selectedImage ? "Change Image" : "Add Image"}
      </Button>

      <input
        className="hidden"
        ref={imageInputRef}
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
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
