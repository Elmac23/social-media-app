import { getUserProfileById } from "@/api/users";
import Typography from "@/components/ui/Typography";
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";
import React from "react";
import GalleryPhoto from "./GalleryPhoto";
import { getUsersPosts } from "@/api/posts";
import { getAvatarUrl } from "@/lib/getAvatarUrl";

type Props = {
  params: Promise<{ id: string }>;
};

async function PhotosPage({ params }: Props) {
  const loggedInUser = await getUser();
  if (!loggedInUser) redirect("/auth/login");
  const { id } = await params;
  const isSelf = loggedInUser.id === id;

  const user = await getUserProfileById(id);

  const userPosts = await getUsersPosts(id);

  return (
    <div>
      <Typography as="h3" className="font-bold mb-4" size="xl">
        {isSelf ? "Your photos" : `${user.name} ${user.lastname}'s photos`}
      </Typography>
      <div className="grid grid-cols-4 gap-4">
        <GalleryPhoto alt={user.name} src={getAvatarUrl(user.avatarUrl)} />
        {userPosts.data.map(
          (post) =>
            post.imageUrl && (
              <GalleryPhoto
                key={post.id}
                alt={post.content}
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}${post.imageUrl}`}
              />
            ),
        )}
      </div>
    </div>
  );
}

export default PhotosPage;
