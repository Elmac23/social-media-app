import { api } from ".";
import { Notification } from "@/types/notification";

export const deleteNotification = (id: string, token: string) => {
  return api.delete(`/notifications/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUserNotifications = (token: string) => {
  return api.get<Notification[]>(`/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
