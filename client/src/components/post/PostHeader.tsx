import React from "react";
import Avatar from "../ui/Avatar";
import Typography from "../ui/Typography";
import PostDropdown from "./PostDropdown";
import { Post } from "@/types/post";
import Link from "next/link";
import { getAvatarUrl } from "@/lib/getAvatarUrl";

type PostHeaderProps = {
  isYourPost: boolean;
  toggleIsEdit: () => void;
  post: Post;
  isSharedPost?: boolean;
};

function PostHeader({
  isYourPost,
  post,
  toggleIsEdit,
  isSharedPost,
}: PostHeaderProps) {
  const { author } = post;
  const avatarUrl = getAvatarUrl(post.author.avatarUrl);

  return (
    <>
      <div className="flex justify-between">
        <Link
          href={`/profile/${author.id}`}
          className="flex items-center gap-2"
        >
          <Avatar
            url={avatarUrl}
            alt={post.author.login || "user avatar"}
            size="md"
          />
          <Typography size="md">
            {`${author.name} ${author.lastname}`} {isSharedPost && "(Shared)"}
          </Typography>
        </Link>
        <PostDropdown
          isYourPost={isYourPost}
          post={post}
          toggleIsEdit={toggleIsEdit}
        />
      </div>
      <Typography size="sm" color="muted" className="mb-4">
        <Link href={`/profile/${author.id}`}>
          @{author.login} {new Date(post.createdAt).toLocaleDateString()}{" "}
          {post.createdAt !== post.updatedAt && "(edited)"}
        </Link>
      </Typography>
    </>
  );
}

export default PostHeader;
