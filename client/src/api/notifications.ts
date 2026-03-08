import { api } from ".";
import { Notification } from "@/types/notification";
import extractDataFromAxios from "@/lib/extractDataFromAxios";
import { WithCount } from "@/types/withCount";
import withToken from "@/lib/withToken";

export const deleteNotification = (id: string, accessToken?: string) => {
  const fn = api.delete(`/notifications/${id}`, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const getUserNotifications = (accessToken?: string) => {
  const fn = api.get<WithCount<Notification>>(
    `/notifications`,
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};
