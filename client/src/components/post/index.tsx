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
import { profile } from "console";
import { TextToLinksParser } from "@/lib/TextToLinksParser";

type PostProps = {
  post: Post;
  profileId?: string;
};

function Post({ post, profileId }: PostProps) {
  const {
    toggle: toggleIsEdit,
    value: isEdit,
    setFalse: setIsNotEdit,
  } = useToggle(false);
  const { user } = useAuth();

  const { author } = post;

  const isYourPost = user?.id === author.id;
  return (
    <Card className="pb-2">
      <PostHeader
        isYourPost={isYourPost}
        post={post}
        toggleIsEdit={toggleIsEdit}
        isSharedPost={profileId !== author.id}
      />
      {isEdit && (
        <EditPost
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

      {post.imageUrl && (
        <PostImage
          imageUrl={`${process.env.NEXT_PUBLIC_SERVER_URL}${post.imageUrl}`}
        />
      )}
      <PostBottom post={post} />
    </Card>
  );
}

export default Post;
