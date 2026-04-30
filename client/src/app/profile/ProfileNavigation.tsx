import NavLink from "@/components/navbar/NavLink";
import Card from "@/components/ui/Card";
import React from "react";

function ProfileNavigation({ userId }: { userId: string }) {
  return (
    <Card className="flex gap-4 mb-8 flex-col md:flex-row">
      <NavLink href={getRoute("", userId)}>Posts</NavLink>
      <NavLink href={getRoute("about", userId)}>About</NavLink>
      <NavLink href={getRoute("friends", userId)}>Friends</NavLink>
      <NavLink href={getRoute("photos", userId)}>Photos</NavLink>
      <NavLink href={getRoute("groups", userId)}>Groups</NavLink>
    </Card>
  );
}

function getRoute(route: string, userId: string) {
  return `/profile/${userId}/${route}`;
}

export default ProfileNavigation;
