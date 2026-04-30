import { getPostById } from "@/api/posts";
import { getUser } from "@/lib/getUser";
import UserDataCard from "../../users/[id]/UserDataCard";
import { getUserProfileById } from "@/api/users";
import ButtonLink from "@/components/ui/ButtonLink";
import VerticalTabs, {
  Tab,
  VerticalTabsButton,
  VerticalTabsButtons,
  VerticalTabsSection,
} from "@/components/ui/verticalTabs";

import PostComments from "./PostComments";
import JSONDebug from "@/components/JSONDebug";
import PostLikes from "./PostLikes";
import PostShares from "./PostShares";
import PostDataCard from "./PostDataCard";

type PostDataProps = {
  params: Promise<{ id: string }>;
};

async function PostDataPage({ params }: PostDataProps) {
  const you = await getUser();
  const { id } = await params;
  const post = await getPostById(id, you?.accessToken);
  const author = await getUserProfileById(post.author.id, you?.accessToken);

  return (
    <div className="p-2">
      <div className="grid xl:grid-cols-2 gap-4">
        <PostDataCard post={post} />
        <UserDataCard user={author}>
          <ButtonLink
            className="inline-block mt-4"
            href={`/admin/users/${author.id}`}
          >
            Browse
          </ButtonLink>
        </UserDataCard>
        <div className="xl:col-span-2">
          <VerticalTabs initial="comments">
            <VerticalTabsButtons>
              <VerticalTabsButton tabName="comments">
                Comments
              </VerticalTabsButton>
              <VerticalTabsButton tabName="likes">Liked by</VerticalTabsButton>
              <VerticalTabsButton tabName="shares">
                Shared by
              </VerticalTabsButton>
            </VerticalTabsButtons>
            <VerticalTabsSection>
              <Tab tabName="comments">
                <PostComments id={post.id} />
              </Tab>
              <Tab tabName="likes">
                <PostLikes id={post.id} />
              </Tab>
              <Tab tabName="shares">
                <PostShares id={post.id} />
              </Tab>
            </VerticalTabsSection>
          </VerticalTabs>
        </div>
      </div>
    </div>
  );
}

export default PostDataPage;
