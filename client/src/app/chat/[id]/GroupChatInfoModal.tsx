import Button from "@/components/ui/Button";
import Modal, { ModalProps } from "@/components/ui/modal";
import { useToggle } from "@/hooks/useToggle";
import { GroupChat } from "@/types/groupChat";
import React from "react";
import { MdCancel, MdEdit } from "react-icons/md";
import GroupChatEdit from "./GroupChatEdit";
import GroupChatInfo from "./GroupChatInfo";

type GroupChatInfoModal = ModalProps & {
  groupChat: GroupChat;
};

function GroupChatInfoModal({
  isOpen,
  onClose,
  groupChat,
}: GroupChatInfoModal) {
  const { toggle, value, setFalse } = useToggle(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="relative">
      <Button
        onClick={toggle}
        className="absolute top-2 right-2"
        variant="ghost"
      >
        {value ? <MdCancel /> : <MdEdit />}
      </Button>
      {value ? (
        <GroupChatEdit groupChat={groupChat} onSuccess={setFalse} />
      ) : (
        <GroupChatInfo groupChat={groupChat} />
      )}
    </Modal>
  );
}

export default GroupChatInfoModal;
