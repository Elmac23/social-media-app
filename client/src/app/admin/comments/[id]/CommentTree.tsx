"use client";

import { getCommentsByParentId } from "@/api/comments";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { useToggle } from "@/hooks/useToggle";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import { Comment } from "@/types/comment";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  MdHideImage,
  MdRemoveRedEye,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

function CommentTree({ comment }: { comment: Comment }) {
  const { toggle, value } = useToggle();
  const { author } = comment;
  const { data } = useQuery({
    queryKey: ["subComments", comment.id],
    queryFn: () => getCommentsByParentId(comment.id),
  });
  const isSubComment = typeof data?.count === "number" && data.count > 0;
  return (
    <div className="flex gap-2">
      <Avatar
        size="lg"
        alt={author.login}
        url={getAvatarUrl(author.avatarUrl)}
        className="self-start mt-2"
      />
      <div className=" flex-1 ">
        <div className="bg-background p-4 mb-2 rounded-md">
          <Typography bold className="mb-2">
            {" "}
            {author.name} {author.lastname}
            <Typography as="span" color="muted" className="inline-block ml-4">
              @{author.login}
            </Typography>
          </Typography>
          <Typography>{comment.content}</Typography>
        </div>
        {isSubComment && (
          <Button
            variant="outline"
            className="mb-4"
            size="small"
            onClick={toggle}
            icon={value ? <MdVisibilityOff /> : <MdVisibility />}
          >
            {value ? "Hide responses" : "Show responses"}
          </Button>
        )}

        {isSubComment &&
          value &&
          data?.data.map((subComment) => (
            <CommentTree key={subComment.id} comment={subComment} />
          ))}
      </div>
    </div>
  );
}

export default CommentTree;
