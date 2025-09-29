"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../AuthProvider";
import { useForm } from "react-hook-form";
import {
  postSchema,
  type CreatePost as EditComment,
} from "@/schema/postSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateComment } from "@/api/comments";
import Input from "../ui/formControl/Input";
import IconButton from "../ui/IconButton";
import { MdEdit } from "react-icons/md";
import { queryClient } from "../QueryProvider";
import { useRouter } from "next/navigation";
import { Comment } from "@/types/comment";

type EditCommentProps = {
  comment: Comment;
  stopEditing: () => void;
};

function EditComment({ stopEditing, comment }: EditCommentProps) {
  const { id, parentCommentId, content, postId } = comment;
  const { register, handleSubmit, reset } = useForm<EditComment>({
    resolver: zodResolver(postSchema),
    values: { content: content },
  });
  const { accessToken } = useAuth();
  const router = useRouter();

  const submitHandler = (data: EditComment) => {
    mutate(data);
    router.refresh();
    stopEditing();
  };

  const { mutate } = useMutation({
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });

      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },

    mutationFn: async (data: EditComment) => {
      updateComment(id, data, accessToken);
    },
  });

  return (
    <form className="my-4 flex" onSubmit={handleSubmit(submitHandler)}>
      <Input fullWidth {...register("content")} />
      <IconButton
        className="rounded-none ring-2 ring-primary-500 rounded-r-sm"
        type="submit"
      >
        <MdEdit />
      </IconButton>
    </form>
  );
}

export default EditComment;
