"use client";

import React from "react";
import { Notification as NotificationType } from "@/types/notification";
import Notification from "./Notification";
import { useTranslations } from "next-intl";

type NotificationsListProps = {
  notifications: NotificationType[];
  deleteNotification: (id: string) => void;
};

function NotificationsList({
  notifications,
  deleteNotification,
}: NotificationsListProps) {
  const t = useTranslations("Notifications");
  if (notifications.length === 0) {
    return (
      <div className="p-4">
        <p className="text-center text-muted">{t("noNotifications")}</p>
      </div>
    );
  }

  return notifications.map((n) => (
    <Notification notification={n} key={n.id} onDelete={deleteNotification} />
  ));
}

export default NotificationsList;
