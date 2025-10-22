"use client";

import React from "react";
import { Notification as NotificationType } from "@/types/notification";
import Notification from "./Notification";

type NotificationsListProps = {
  notifications: NotificationType[];
  deleteNotification: (id: string) => void;
};

function NotificationsList({
  notifications,
  deleteNotification,
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="p-4">
        <p className="text-center text-muted">No notifications</p>
      </div>
    );
  }

  return notifications.map((n) => (
    <Notification notification={n} key={n.id} onDelete={deleteNotification} />
  ));
}

export default NotificationsList;
