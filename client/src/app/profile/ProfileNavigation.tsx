import NavLink from "@/components/navbar/NavLink";
import Card from "@/components/ui/Card";
import { useTranslations } from "next-intl";
import React from "react";

function ProfileNavigation({ userId }: { userId: string }) {
  const t = useTranslations("UserProfile.navigation");
  return (
    <Card className="flex gap-4 mb-8 flex-col md:flex-row">
      <NavLink href={getRoute("", userId)}>{t("posts")}</NavLink>
      <NavLink href={getRoute("about", userId)}>{t("about")}</NavLink>
      <NavLink href={getRoute("friends", userId)}>{t("friends")}</NavLink>
      <NavLink href={getRoute("photos", userId)}>{t("photos")}</NavLink>
      <NavLink href={getRoute("groups", userId)}>{t("groups")}</NavLink>
    </Card>
  );
}

function getRoute(route: string, userId: string) {
  return `/profile/${userId}/${route}`;
}

export default ProfileNavigation;
