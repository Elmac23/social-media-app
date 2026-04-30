import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import { getUser } from "@/lib/getUser";
import UserDataCard from "../../users/[id]/UserDataCard";
import { getUserProfileById } from "@/api/users";
import ButtonLink from "@/components/ui/ButtonLink";
import Badge from "@/components/ui/badge";
import { formatDate } from "date-fns";
import { getCommentById } from "@/api/comments";
import { getPostById } from "@/api/posts";
import PostDataCard from "../../posts/[id]/PostDataCard";
import CommentTree from "./CommentTree";
import CommentLikes from "./CommentLikes";

type CommentDataProps = {
  params: Promise<{ id: string }>;
};

async function CommentDataPage({ params }: CommentDataProps) {
  const you = await getUser();
  const { id } = await params;
  const comment = await getCommentById(id, you?.accessToken);
  const author = await getUserProfileById(comment.author.id, you?.accessToken);
  const post = await getPostById(comment.postId, you?.accessToken);

  return (
    <div className="p-2">
      <div className="grid xl:grid-cols-2 gap-4">
        <Card className="xl:row-span-2">
          <Typography as="h2" size="xl" bold className="mb-2">
            Comment Data
          </Typography>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>Id: {comment.id}</Badge>
            <Badge>
              Created at {formatDate(comment.createdAt, "dd/MM/yyyy")}
            </Badge>
            <Badge>
              Edited at {formatDate(comment.updatedAt || "", "dd/MM/yyyy")}
            </Badge>
            <Badge>Likes: {comment.likesCount}</Badge>
            <Badge>Responses: {comment.subCommentsCount}</Badge>
          </div>

          <CommentTree comment={comment} />
        </Card>
        <UserDataCard user={author}>
          <ButtonLink
            variant="outline"
            className="inline-block mt-4"
            href={`/admin/users/${author.id}`}
          >
            Browse
          </ButtonLink>
        </UserDataCard>
        <PostDataCard post={post}>
          <ButtonLink
            variant="outline"
            className="inline-block mt-4"
            href={`/admin/posts/${post.id}`}
          >
            Browse
          </ButtonLink>
        </PostDataCard>
        <Card className="lg:col-span-2 bg-background">
          <CommentLikes id={comment.id} />
        </Card>
      </div>
    </div>
  );
}

export default CommentDataPage;
