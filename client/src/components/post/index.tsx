"use client";

import React from "react";
import Card from "../ui/Card";
import Typography from "../ui/Typography";
import type { Post } from "@/types/post";
import PostBottom from "./PostBottom";
import PostImage from "./PostImage";
import { useAuth } from "../AuthProvider";
import { useToggle } from "@/hooks/useToggle";
import EditPost from "./EditPost";
import PostHeader from "./PostHeader";
import { TextToLinksParser } from "@/lib/TextToLinksParser";
import { cn } from "@/lib/cn";

type PostProps = {
  post: Post;
  profileId?: string;
  className?: string;
};

function Post({ post, profileId, className }: PostProps) {
  const {
    toggle: toggleIsEdit,
    value: isEdit,
    setFalse: setIsNotEdit,
  } = useToggle(false);
  const { user } = useAuth();

  const { author } = post;

  const isYourPost = user?.id === author.id;
  return (
    <Card className={cn("md:pb-4", className)}>
      <PostHeader
        isYourPost={isYourPost}
        post={post}
        toggleIsEdit={toggleIsEdit}
        isSharedPost={profileId !== author.id}
      />
      {isEdit && (
        <EditPost
          privacy={post.privacy}
          postId={post.id}
          value={post.content}
          stopEditing={setIsNotEdit}
        />
      )}
      {!isEdit && (
        <Typography className="mb-4">
          {" "}
          {TextToLinksParser(post.content)}
        </Typography>
      )}

      {post.fileId && <PostImage imageId={post.fileId} />}
      <PostBottom post={post} />
    </Card>
  );
}

export default Post;
