"use client";

import React from "react";
import Image from "next/image";
import { User } from "@/types/user";
import IconButton from "@/components/ui/IconButton";
import { MdAdd } from "react-icons/md";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/ui/modal";
import AvatarEditor from "./AvatarEditor";
import Typography from "@/components/ui/Typography";
import FullScreenImage from "@/components/fullScreenImage";
import { getAvatarUrl } from "@/lib/getAvatarUrl";

type ProfileAvatarProps = {
  user: User;
  isSelf: boolean;
};

function ProfileAvatar({ user, isSelf }: ProfileAvatarProps) {
  const { close, isOpen, open } = useModal();
  const avatarUrl = getAvatarUrl(user.avatarUrl);
  return (
    <div className="relative">
      <FullScreenImage imageUrl={avatarUrl} alt={user.name || "avatar"}>
        <Image
          src={avatarUrl}
          alt="avatar"
          width="100"
          height="100"
          className="rounded-full ring-4 ring-primary-500"
        />
      </FullScreenImage>
      {isSelf && (
        <IconButton
          className="absolute top-0 right-0"
          size="small"
          disabled={!isSelf}
          onClick={open}
        >
          <MdAdd />
        </IconButton>
      )}
      <Modal
        isOpen={isOpen}
        onClose={close}
        className="grid place-items-center"
      >
        <Typography className="mb-4" size="xl" as="h2">
          Edit Avatar
        </Typography>
        <AvatarEditor onSave={close} />
      </Modal>
    </div>
  );
}

export default ProfileAvatar;
