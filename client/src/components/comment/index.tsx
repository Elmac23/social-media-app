"use client";

import React from "react";
import Avatar from "../ui/Avatar";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import { useToggle } from "@/hooks/useToggle";
import { useCommentContext } from "../post/PostBottom";
import type { Comment as AppComment } from "@/types/comment";
import { useQuery } from "@tanstack/react-query";
import { getCommentsByParentId } from "@/api/comments";
import LikeCommentButton from "./LikeCommentButton";
import { useAuth } from "../AuthProvider";
import AddComment from "./AddComment";
import IconButton from "../ui/IconButton";
import { MdEditDocument, MdSettings } from "react-icons/md";
import Dropdown from "../ui/dropdown";
import DropdownTrigger from "../ui/dropdown/DropdownTrigger";
import DropdownBody from "../ui/dropdown/DropdownBody";
import DeleteCommentButton from "./DeleteCommentButton";
import EditComment from "./EditComment";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import { TextToLinksParser } from "@/lib/TextToLinksParser";

type CommentProps = React.PropsWithChildren & {
  comment: AppComment;
};

function Comment({ comment }: CommentProps) {
  const {
    value: isEdited,
    toggle: toggleIsEdited,
    setFalse: setIsNotEdited,
  } = useToggle(false);
  const { user } = useAuth();
  const { author } = comment;
  const isYourComment = user?.id === author.id;
  const { value: answerVisible, toggle: toggleAnswerVisible } =
    useToggle(false);

  const { setSelectedCommentId, selectedCommentId, postId } =
    useCommentContext();

  const {
    data: subComments,
    isLoading: subCommentsLoading,
    isError: subCommentsError,
  } = useQuery({
    queryKey: ["comments", comment.id],
    queryFn: () => getCommentsByParentId(comment.id).then((res) => res.data),
    enabled: answerVisible,
  });

  const avatarUrl = getAvatarUrl(author.avatarUrl);

  return (
    <div>
      <div className="flex items-start gap-2 mb-2">
        <Avatar
          url={avatarUrl}
          alt={author?.login || "user avatar"}
          size="md"
        />
        <div className="py-2 px-4 border-b-2 border-background/30 bg-background/50 rounded-lg w-full relative">
          <div className="absolute bottom-2 right-2">
            <Dropdown>
              <DropdownTrigger>
                <IconButton variant="ghost" size="small" type="button">
                  <MdSettings />
                </IconButton>
              </DropdownTrigger>
              <DropdownBody className="w-max">
                {isYourComment && (
                  <div className="flex flex-col gap-2">
                    <Button
                      icon={<MdEditDocument />}
                      center
                      fullWidth
                      variant="ghost"
                      onClick={toggleIsEdited}
                    >
                      Edit Comment
                    </Button>
                    <DeleteCommentButton commentId={comment.id} />
                  </div>
                )}
                {!isYourComment && (
                  <Button center fullWidth variant="ghost">
                    Report
                  </Button>
                )}
              </DropdownBody>
            </Dropdown>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <Typography
              size="md"
              className="font-bold"
            >{`${author.name} ${author.lastname}`}</Typography>
            <div className="flex justify-between grow">
              <Typography size="sm" color="muted">
                @{author.login}
              </Typography>
              <Typography size="sm" color="muted">
                {new Date(comment.createdAt).toLocaleDateString()}
              </Typography>
            </div>
          </div>
          {isEdited && (
            <EditComment stopEditing={setIsNotEdited} comment={comment} />
          )}
          {!isEdited && (
            <Typography className="mb-2">
              {TextToLinksParser(comment.content)}
            </Typography>
          )}

          <div className="flex gap-4">
            <LikeCommentButton
              isLiked={comment.isLikedByMe}
              likeCount={comment.likesCount}
              commentId={comment.id}
            />
            <Button
              variant="link"
              size="small"
              className={answerVisible ? "text-primary-500" : ""}
              onClick={() => {
                if (answerVisible) {
                  setSelectedCommentId(undefined);
                } else {
                  setSelectedCommentId(comment.id);
                }
                toggleAnswerVisible();
              }}
            >
              Responses
            </Button>
          </div>
        </div>
      </div>
      <div className="pl-8">
        {answerVisible && (
          <>
            {selectedCommentId === comment.id && (
              <AddComment parentCommentId={comment.id} postId={postId} />
            )}
            {subCommentsLoading && (
              <Typography size="sm">Loading...</Typography>
            )}
            {subCommentsError && (
              <Typography size="sm" color="danger">
                Error loading comments
              </Typography>
            )}
            {subComments &&
              subComments.map((subComment) => (
                <Comment key={subComment.id} comment={subComment} />
              ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Comment;
