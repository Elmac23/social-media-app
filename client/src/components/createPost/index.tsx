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
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { postSchema, type CreatePost } from "@/schema/postSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdDelete } from "react-icons/md";
import IconButton from "../ui/IconButton";
import PostImage from "../post/PostImage";
import FileInput from "../ui/formControl/FileInput";
import { useTranslations } from "next-intl";
import Select, { Option } from "../ui/formControl/Select";
import { PrivacyOptions } from "@/types/user";

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
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreatePost>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      privacy: "PUBLIC",
    },
  });

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
      formData.append("privacy", data.privacy);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      createPost(formData);
    },
  });

  const t = useTranslations("UserProfile.posts");

  return (
    <Card className="mb-4">
      <form onSubmit={handleSubmit(submitHandler)}>
        <FormControl error={errors.content?.message}>
          <div className="flex mb-4 justify-between">
            <Label className="mb-2">{t("createPost")}</Label>
            <Controller
              control={control}
              name="privacy"
              render={({ field: { value } }) => (
                <Select
                  size="small"
                  setValue={(v: PrivacyOptions) => setValue("privacy", v)}
                  value={value}
                  className="ml-auto"
                >
                  <Option value="PUBLIC">{t("visibility.public")}</Option>
                  <Option value="FRIENDS">{t("visibility.friends")}</Option>
                  <Option value="PRIVATE">{t("visibility.hidden")}</Option>
                </Select>
              )}
            />
          </div>

          <div className="mb-4">
            <Textarea
              placeholder={t("postPlaceholder")}
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
          <Button type="submit">{t("upload")}</Button>
          <Button type="button" variant="ghost" onClick={() => handleReset()}>
            {t("cancel")}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default CreatePost;
