import Post from "@/components/post";
import React from "react";

type Props = {
  posts: Post[];
  profileId: string;
};

function PostsList({ posts, profileId }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <Post post={post} key={post.id} profileId={profileId} />
      ))}
    </div>
  );
}

export default PostsList;
