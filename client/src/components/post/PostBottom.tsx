"use client";

import React from "react";
import { MdChat } from "react-icons/md";
import Button from "../ui/Button";
import LikePostButton from "./LikePostButton";
import { Post } from "@/types/post";
import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/lib/cn";
import Comment from "../comment";
import AddComment from "../comment/AddComment";
import { useQuery } from "@tanstack/react-query";
import { getPostComments } from "@/api/comments";
import ShareButton from "./ShareButton";
import { useAuth } from "../AuthProvider";

type PostBottomProps = {
  post: Post;
};

const commentContext = React.createContext<{
  selectedCommentId?: string;
  postId: string;
  setSelectedCommentId: (id?: string) => void;
}>({
  selectedCommentId: undefined,
  setSelectedCommentId: () => {},
  postId: "",
});

export function useCommentContext() {
  return React.useContext(commentContext);
}

function PostBottom({ post }: PostBottomProps) {
  const { value: isCommentVisible, toggle: toggleCommentVisible } =
    useToggle(false);
  const [selectedCommentId, setSelectedCommentId] = React.useState<string>();

  const { data: comments } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => getPostComments(post.id).then((res) => res.data),
  });

  const { user } = useAuth();

  return (
    <commentContext.Provider
      value={{ selectedCommentId, setSelectedCommentId, postId: post.id }}
    >
      <div
        className={cn(
          "flex gap-4 border-t-2 border-background/30 pt-2",
          isCommentVisible && "border-b-2 pb-2"
        )}
      >
        <LikePostButton
          likeCount={post.likesCount}
          postId={post.id}
          isLiked={post.isLikedByMe}
        />
        <Button
          icon={<MdChat />}
          variant="ghost"
          className="grow"
          fullWidth
          onClick={() => {
            toggleCommentVisible();
            setSelectedCommentId(undefined);
          }}
          center
        >
          Comment ({post.commentsCount || 0})
        </Button>
        {post.author.id !== user?.id && (
          <ShareButton postId={post.id} isSharedByMe={post.isSharedByMe} />
        )}
      </div>

      {isCommentVisible && !selectedCommentId && (
        <AddComment postId={post.id} />
      )}

      {isCommentVisible &&
        comments &&
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
    </commentContext.Provider>
  );
}

export default PostBottom;
