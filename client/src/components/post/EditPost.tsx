"use client";

import React from "react";
import Textarea from "../ui/formControl/Textarea";
import FormControl from "../ui/formControl";
import Button from "../ui/Button";
import FormError from "../ui/formControl/FormError";
import { useMutation } from "@tanstack/react-query";
import { updatePost } from "@/api/posts";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { postSchema, type CreatePost as EditPost } from "@/schema/postSchema";
import { zodResolver } from "@hookform/resolvers/zod";

type EditPostProps = {
  postId: string;
  value: string;
  stopEditing: () => void;
};

function EditPost({ postId, stopEditing, value }: EditPostProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditPost>({
    resolver: zodResolver(postSchema),
    values: { content: value },
  });

  const router = useRouter();

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
            placeholder="What's on your mind?"
            {...register("content")}
          />
          <FormError />
        </div>
      </FormControl>

      <div className="flex gap-2">
        <Button type="submit">Update</Button>
        <Button type="button" variant="ghost" onClick={stopEditing}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default EditPost;
