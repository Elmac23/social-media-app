import { getUserProfileById } from "@/api/users";
import React from "react";
import ProfileHeader from "../ProfileHeader";
import ProfileNavigation from "../ProfileNavigation";
import { getUserFriends } from "@/api/friends";
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

async function ProfileLayout({ children, params }: Props) {
  const { id } = await params;
  const loggedInUser = await getUser();
  if (!loggedInUser) redirect("/auth/login");
  const user = await getUserProfileById(id, loggedInUser.accessToken);
  const userFriends = await getUserFriends(id, loggedInUser.accessToken);

  return (
    <main className="max-w-7xl mx-auto p-8">
      <ProfileHeader user={user.data} friendsCount={userFriends.data.length} />
      <ProfileNavigation userId={user.data.id} />
      {children}
    </main>
  );
}

export default ProfileLayout;
