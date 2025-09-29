import React from "react";
import { MdSettings, MdEditDocument } from "react-icons/md";
import Button from "../ui/Button";
import Dropdown from "../ui/dropdown";
import DropdownBody from "../ui/dropdown/DropdownBody";
import DropdownTrigger from "../ui/dropdown/DropdownTrigger";
import IconButton from "../ui/IconButton";
import DeletePostButton from "./DeletePostButton";
import { Post } from "@/types/post";

type PostDropdownProps = {
  isYourPost: boolean;
  toggleIsEdit: () => void;
  post: Post;
};

function PostDropdown({ isYourPost, post, toggleIsEdit }: PostDropdownProps) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <IconButton variant="ghost">
          <MdSettings />
        </IconButton>
      </DropdownTrigger>
      <DropdownBody className="w-max flex gap-4 flex-col">
        {isYourPost && (
          <>
            <Button
              icon={<MdEditDocument />}
              center
              fullWidth
              variant="ghost"
              onClick={toggleIsEdit}
            >
              Edit Post
            </Button>
            <DeletePostButton postId={post.id} />
          </>
        )}
        {!isYourPost && (
          <Button center fullWidth variant="ghost">
            Report
          </Button>
        )}
      </DropdownBody>
    </Dropdown>
  );
}

export default PostDropdown;
