"use client";

import React from "react";
import Textarea from "../ui/formControl/Textarea";
import FormControl from "../ui/formControl";
import Button from "../ui/Button";
import FormError from "../ui/formControl/FormError";
import { useMutation } from "@tanstack/react-query";
import { updatePost } from "@/api/posts";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { postSchema, type CreatePost as EditPost } from "@/schema/postSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { PrivacyOptions } from "@/types/user";
import Select, { Option } from "../ui/formControl/Select";

type EditPostProps = {
  postId: string;
  value: string;
  privacy: PrivacyOptions;
  stopEditing: () => void;
};

function EditPost({ postId, stopEditing, value, privacy }: EditPostProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<EditPost>({
    resolver: zodResolver(postSchema),
    values: { content: value, privacy },
  });

  const router = useRouter();

  const t = useTranslations("UserProfile.posts");

  const submitHandler = (data: EditPost) => {
    mutate(data);
    stopEditing();
  };

  const { mutate } = useMutation({
    onSuccess: () => {
      reset();
      router.refresh();
    },

    mutationFn: async (data: EditPost) => {
      updatePost(postId, data);
    },
  });

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="mb-4">
      <FormControl error={errors.content?.message}>
        <div className="mb-4">
          <Textarea
            placeholder={t("postPlaceholder")}
            {...register("content")}
          />
          <FormError />
        </div>
      </FormControl>

      <div className="flex gap-2 w-full items-center">
        <Button type="submit">{t("update")}</Button>
        <Button type="button" variant="ghost" onClick={stopEditing}>
          Cancel
        </Button>
        <Controller
          name="privacy"
          control={control}
          render={({ field }) => (
            <Select
              size="small"
              setValue={(v: PrivacyOptions) => setValue("privacy", v)}
              value={field.value}
              className="ml-5 block"
            >
              <Option value="PUBLIC">{t("visibility.public")}</Option>
              <Option value="FRIENDS">{t("visibility.friends")}</Option>
              <Option value="PRIVATE">{t("visibility.hidden")}</Option>
            </Select>
          )}
        />
      </div>
    </form>
  );
}

export default EditPost;
