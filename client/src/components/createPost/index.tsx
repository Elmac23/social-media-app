"use client";

import React, { useEffect } from "react";
import Card from "../ui/Card";
import Textarea from "../ui/formControl/Textarea";
import FormControl from "../ui/formControl";
import Label from "../ui/formControl/Label";
import Button from "../ui/Button";
import FormError from "../ui/formControl/FormError";
import { useMutation } from "@tanstack/react-query";
import { createPost } from "@/api/posts";
import { useAuth } from "../AuthProvider";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { postSchema, type CreatePost } from "@/schema/postSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdDelete } from "react-icons/md";
import IconButton from "../ui/IconButton";
import PostImage from "../post/PostImage";
import FileInput from "../ui/formControl/FileInput";

function CreatePost() {
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedImage);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePost>({
    resolver: zodResolver(postSchema),
  });
  const { accessToken } = useAuth();

  const router = useRouter();

  const removeImage = () => {
    setSelectedImage(null);
  };

  const submitHandler = (data: CreatePost) => {
    mutate(data);
  };

  const handleReset = () => {
    reset();
    setSelectedImage(null);
  };

  const { mutate } = useMutation({
    onSuccess: () => {
      reset();
      setSelectedImage(null);

      router.refresh();
    },

    mutationFn: async (data: CreatePost) => {
      const formData = new FormData();
      formData.append("content", data.content);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      createPost(formData, accessToken);
    },
  });

  return (
    <Card className="mb-4">
      <form onSubmit={handleSubmit(submitHandler)}>
        <FormControl error={errors.content?.message}>
          <Label className="mb-2">Create Post</Label>
          <div className="mb-4">
            <Textarea
              placeholder="What's on your mind?"
              {...register("content")}
            />
            <FormError />
          </div>
        </FormControl>

        {imagePreview && (
          <div className="relative">
            <IconButton
              className="absolute -top-2 -right-2"
              variant="secondary"
              type="button"
              onClick={removeImage}
            >
              <MdDelete />
            </IconButton>
            <PostImage imageUrl={imagePreview} />
          </div>
        )}

        <div className="flex gap-2">
          <FileInput
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
          <Button type="submit">Upload</Button>
          <Button type="button" variant="ghost" onClick={() => handleReset()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default CreatePost;
