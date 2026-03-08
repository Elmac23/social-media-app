import Typography from "@/components/ui/Typography";
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";
import React from "react";

import UserMiniProfile from "../../friends/UserMiniProfile";
import { getUserFriends } from "@/api/friends";
import { getUserProfileById } from "@/api/users";
import YourBio from "./YourBio";
import Bio from "./Bio";

import { getPostById, getUsersFeed } from "@/api/posts";
import PostsList from "./PostsList";
import CreatePost from "@/components/createPost";
import { tryOrUndefined } from "@/lib/tryOrUndefined";
import { Post as PostType } from "@/types/post";
import Post from "@/components/post";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function UserProfile({ params, searchParams }: Props) {
  const { id } = await params;
  const { featuredPostId } = await searchParams;
  const loggedInUser = await getUser();
  if (!loggedInUser) redirect("/auth/login");

  const user = await getUserProfileById(id, loggedInUser.accessToken);
  const feedPosts = await getUsersFeed(id, loggedInUser.accessToken);

  const friends = await getUserFriends(user.id, {}, loggedInUser.accessToken);

  const isSelf = loggedInUser.id === user.id;

  let featuredPost: PostType | undefined = undefined;
  if (featuredPostId && typeof featuredPostId === "string") {
    const response = await tryOrUndefined(
      getPostById(featuredPostId, loggedInUser.accessToken),
    );
    featuredPost = response;
  }

  if (featuredPost && featuredPost.author.id !== user.id)
    featuredPost = undefined;
  return (
    <div className="flex gap-8 flex-col-reverse lg:flex-row">
      <div className="grow">
        {featuredPost && (
          <>
            <Typography size="lg" bold={true} color="primary" className="mb-2">
              Featured
            </Typography>
            <Post
              post={featuredPost}
              profileId={id}
              className="mb-4 ring-4 ring-primary-500 "
            />
          </>
        )}
        <Typography as="h3" className="font-bold mb-4" size="xl">
          Posts
        </Typography>

        {isSelf && <CreatePost />}
        {feedPosts.count === 0 && (
          <Typography color="muted">No posts yet</Typography>
        )}

        {feedPosts.count > 0 && (
          <PostsList profileId={id} posts={feedPosts.data} />
        )}
      </div>

      <div className="md:sticky md:top-24 md:self-start">
        {isSelf ? (
          <YourBio userId={user.id} value={user.bio} />
        ) : (
          <Bio
            header={
              <Typography size="lg" as="h3" className="font-bold">
                About me
              </Typography>
            }
          >
            <Typography as="pre" color={user.bio ? "primary" : "muted"}>
              {user.bio || "No bio added yet."}
            </Typography>
          </Bio>
        )}
        <Typography size="lg" as="h3" className="font-bold mb-4">
          Friends
        </Typography>

        <div className="grid grid-cols-2 gap-4">
          {friends.count === 0 && (
            <Typography color="muted">No friends yet</Typography>
          )}
          {friends.count > 0 &&
            friends.data
              .slice(0, 8)
              .map((friend) => (
                <UserMiniProfile user={friend} key={friend.id} />
              ))}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
