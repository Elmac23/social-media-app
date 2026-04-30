import PostImage from "@/components/post/PostImage";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import { Post } from "@/types/post";
import { formatDate } from "date-fns";
import React from "react";

function PostDataCard({
  post,
  children,
}: React.PropsWithChildren<{ post: Post }>) {
  return (
    <Card>
      <Typography as="h2" size="xl" bold className="mb-2">
        Post Data
      </Typography>
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge>Id: {post.id}</Badge>
        <Badge>Created at {formatDate(post.createdAt, "dd/MM/yyyy")}</Badge>
        <Badge>
          Edited at {formatDate(post.updatedAt || "", "dd/MM/yyyy")}
        </Badge>
      </div>
      <Typography
        as="pre"
        className="border-[1px] rounded-sm border-border p-2 mb-4"
      >
        {post.content}
      </Typography>
      {post.imageUrl && (
        <PostImage
          imageUrl={`${process.env.NEXT_PUBLIC_SERVER_URL}${post.imageUrl}`}
        />
      )}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge>Likes: {post.likesCount}</Badge>
        <Badge>Comments: {post.commentsCount}</Badge>
        <Badge>Reposts: {post.sharedPostsCount}</Badge>
      </div>
      {children}
    </Card>
  );
}

export default PostDataCard;
