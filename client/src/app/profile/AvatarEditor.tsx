"use client";

import { updateUser } from "@/api/users";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/ui/Button";
import FileInput from "@/components/ui/formControl/FileInput";
import Typography from "@/components/ui/Typography";
import getCroppedImg from "@/lib/cropImage";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

type AvatarEditorProps = {
  onSave: () => void;
};

export default function AvatarEditor({ onSave }: AvatarEditorProps) {
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const { accessToken, user } = useAuth();
  const userId = user?.id;

  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async (avatar: string) => {
      if (!avatar) return;
      if (!userId || !accessToken) return;

      const res = await fetch(avatar);
      const blob = await res.blob();
      const file = new File(
        [blob],
        `avatar.${blob.type.split("/")?.[1] ?? "jpg"}`,
        {
          type: blob.type,
        }
      );

      const formData = new FormData();
      formData.append("avatar", file);
      return updateUser(userId, formData, accessToken);
    },
    onSuccess: () => {
      router.refresh();
      onSave();
    },
  });

  useEffect(() => {
    if (!selectedImage) {
      setImageUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedImage);
    setImageUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const onCropComplete = async (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSubmit = async () => {
    if (!imageUrl || !croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
    mutate(croppedImage);
    onSave();
  };
  return (
    <>
      {!selectedImage && (
        <FileInput
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
      {selectedImage && (
        <>
          <div className="relative w-full h-[80vh] ">
            <div className="w-full h-full">
              <Cropper
                style={{
                  containerStyle: { backgroundColor: "transparent" },
                }}
                image={imageUrl!}
                crop={crop}
                zoom={zoom}
                aspect={1 / 1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
          </div>
          <div className=" w-full flex justify-between bg-background-lighter mt-4">
            <div className="flex gap-2 items-center">
              <Typography>Scale</Typography>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => {
                  setZoom(Number(e.target.value));
                }}
                className="accent-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit}>Save</Button>
              <FileInput
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
