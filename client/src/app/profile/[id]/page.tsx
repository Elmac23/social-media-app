import Typography from "@/components/ui/Typography";
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";
import React from "react";

import UserMiniProfile from "../../friends/UserMiniProfile";
import { getUserFriends } from "@/api/friends";
import { getUserProfileById } from "@/api/users";
import YourBio from "./YourBio";
import Bio from "./Bio";

import { getUsersFeed, getUsersPosts } from "@/api/posts";
import PostsList from "./PostsList";
import JSONDebug from "@/components/JSONDebug";
import CreatePost from "@/components/createPost";
import FullScreenImage from "@/components/fullScreenImage";

type Props = {
  params: Promise<{ id: string }>;
};

async function UserProfile({ params }: Props) {
  const { id } = await params;
  const loggedInUser = await getUser();
  if (!loggedInUser) redirect("/auth/login");

  const user = await getUserProfileById(id, loggedInUser.accessToken);
  const feedPosts = await getUsersFeed(id, loggedInUser.accessToken);

  const friends = await getUserFriends(user.data.id, loggedInUser.accessToken);

  const isSelf = loggedInUser.id === user.data.id;

  return (
    <div className="flex gap-8 flex-col-reverse lg:flex-row">
      <div className="grow">
        <Typography as="h3" className="font-bold mb-4" size="xl">
          Posts
        </Typography>

        {isSelf && <CreatePost />}
        {feedPosts.data.length === 0 && (
          <Typography color="muted">No posts yet</Typography>
        )}
        {feedPosts.data.length > 0 && (
          <PostsList profileId={id} posts={feedPosts.data} />
        )}
      </div>

      <div className="md:sticky md:top-24 md:self-start">
        {isSelf ? (
          <YourBio userId={user.data.id} value={user.data.bio} />
        ) : (
          <Bio
            header={
              <Typography size="lg" as="h3" className="font-bold">
                About me
              </Typography>
            }
          >
            <Typography as="pre" color={user.data.bio ? "primary" : "muted"}>
              {user.data.bio || "No bio added yet."}
            </Typography>
          </Bio>
        )}
        <Typography size="lg" as="h3" className="font-bold mb-4">
          Friends
        </Typography>

        <div className="grid grid-cols-2 gap-4">
          {friends.data.length === 0 && (
            <Typography color="muted">No friends yet</Typography>
          )}
          {friends.data.length > 0 &&
            friends.data.map((friend) => (
              <UserMiniProfile user={friend} key={friend.id} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
