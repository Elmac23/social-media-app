"use client";

import React from "react";
import Input from "../ui/formControl/Input";
import { MdUpload } from "react-icons/md";
import IconButton from "../ui/IconButton";
import { useAddComment } from "@/hooks/useAddComment";

type AddCommentProps = {
  parentCommentId?: string;
  parentCommentAuthorId?: string;
};

function AddComment({
  parentCommentAuthorId,
  parentCommentId,
}: AddCommentProps) {
  const { message, mutate, setMessage } = useAddComment({
    parentCommentAuthorId,
    parentCommentId,
  });

  return (
    <form
      className="flex my-4"
      onSubmit={(e) => {
        e.preventDefault();
        mutate(message);
      }}
    >
      <Input
        borderClassName="rounded-r-none"
        placeholder="Your thoughts"
        className="rounded-none"
        fullWidth
        value={message}
        onInput={(e) => setMessage((e.target as HTMLInputElement).value)}
      />
      <IconButton
        className="rounded-none h-10 ring-2 ring-primary-500 rounded-r-sm "
        type="submit"
      >
        <MdUpload />
      </IconButton>
    </form>
  );
}

export default AddComment;
