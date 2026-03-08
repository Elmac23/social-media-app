"use client";

import React, { useCallback, useEffect } from "react";
import { MdNotifications } from "react-icons/md";
import Button from "../ui/Button";
import Dropdown from "../ui/dropdown";
import DropdownBody from "../ui/dropdown/DropdownBody";
import DropdownTrigger from "../ui/dropdown/DropdownTrigger";
import Typography from "../ui/Typography";
import NotificationCounter from "./NotificationCounter";
import NotificationsList from "./NotificationsList";
import { Notification } from "@/types/notification";
import { useSocket } from "../SocketProvider";
import { WithCount } from "@/types/withCount";

type NotificationsProps = {
  initialNotifications: WithCount<Notification>;
};

function Notifications({ initialNotifications }: NotificationsProps) {
  const [notifications, setNotifications] = React.useState<Notification[]>(
    initialNotifications.data,
  );

  const addNotification = useCallback(
    (notification: Notification) => {
      const existingNotification = notifications.find(
        (n) => n.id === notification.id,
      );
      if (!existingNotification)
        return setNotifications((prev) => [notification, ...prev]);

      const restNotifications = notifications.filter(
        (n) => n.id !== notification.id,
      );
      setNotifications([notification, ...restNotifications]);
    },
    [setNotifications, notifications],
  );
  const { socket } = useSocket();

  const deleteNotification = useCallback(
    (notificationId: string) => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId),
      );
    },
    [setNotifications],
  );

  useEffect(() => {
    if (!socket) return;
    socket.on("notification", addNotification);
    return () => {
      socket.off("notification", addNotification);
    };
  }, [socket, addNotification]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="ghost" icon={<MdNotifications />}>
          <Typography as="span" className="text-primary-500 inline-block mr-2">
            <NotificationCounter count={notifications.length} />
          </Typography>
          Notifications
        </Button>
      </DropdownTrigger>
      <DropdownBody className="space-y-2 divide-y-2 divide-background/30 right-0 mt-8 w-90">
        <Typography className="p-2" bold>
          Notifications
        </Typography>
        <NotificationsList
          notifications={notifications}
          deleteNotification={deleteNotification}
        />
      </DropdownBody>
    </Dropdown>
  );
}

export default Notifications;
