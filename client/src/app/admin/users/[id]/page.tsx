import { getPrivacy } from "@/api/privacy";
import { getUserProfileById } from "@/api/users";
import Typography from "@/components/ui/Typography";
import { getUser } from "@/lib/getUser";
import UsersPosts from "./UsersPosts";
import UserComments from "./UserComments";
import UserFriends from "./UserFriends";
import VerticalTabs, {
  Tab,
  VerticalTabsButton,
  VerticalTabsButtons,
  VerticalTabsSection,
} from "@/components/ui/verticalTabs";
import UserFollowing from "./UserFollowing";
import UserFollowers from "./UserFollowers";
import UserDataCard from "./UserDataCard";
import UserPrivacyCard from "./UserPrivacyCard";
import UserMessages from "./UserMessages";
import UserGroupChats from "./UserGroupChats";

type UserDataProps = {
  params: Promise<{ id: string }>;
};

async function UserDataPage({ params }: UserDataProps) {
  const you = await getUser();
  const { id } = await params;
  const userData = await getUserProfileById(id, you?.accessToken);

  const userPrivacy = await getPrivacy(id, you?.accessToken);
  console.log(userData);
  return (
    <div className="p-2">
      <Typography as="h2" size="xl" bold className="mb-2">
        User Profile
      </Typography>
      <div className="grid xl:grid-cols-2 gap-4">
        <UserDataCard user={userData} />
        <UserPrivacyCard privacy={userPrivacy} />

        <div className="xl:col-span-2">
          <VerticalTabs initial="posts">
            <VerticalTabsButtons>
              <VerticalTabsButton tabName="posts">Posts</VerticalTabsButton>
              <VerticalTabsButton tabName="comments">
                Comments
              </VerticalTabsButton>
              <VerticalTabsButton tabName="friends">Friends</VerticalTabsButton>
              <VerticalTabsButton tabName="followers">
                Followers
              </VerticalTabsButton>
              <VerticalTabsButton tabName="following">
                Following
              </VerticalTabsButton>
              <VerticalTabsButton tabName="group-chats">
                Group Chats
              </VerticalTabsButton>
              <VerticalTabsButton tabName="messages">
                Messages
              </VerticalTabsButton>
            </VerticalTabsButtons>
            <VerticalTabsSection>
              <Tab tabName="posts">
                <UsersPosts id={id} />
              </Tab>
              <Tab tabName="comments">
                <UserComments id={id} />
              </Tab>

              <Tab tabName="friends">
                <UserFriends id={id} />
              </Tab>

              <Tab tabName="following">
                <UserFollowing id={id} />
              </Tab>

              <Tab tabName="followers">
                <UserFollowers id={id} />
              </Tab>
              <Tab tabName="group-chats">
                <UserGroupChats id={id} />
              </Tab>
              <Tab tabName="messages">
                <UserMessages id={id} />
              </Tab>
            </VerticalTabsSection>
          </VerticalTabs>
        </div>
      </div>
    </div>
  );
}

export default UserDataPage;
