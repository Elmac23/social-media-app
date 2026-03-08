import VerticalTabs, {
  VerticalTabsButtons,
  VerticalTabsButton,
  VerticalTabsSection,
  Tab,
} from "@/components/ui/verticalTabs";
import React from "react";
import UsersTab from "./UsersTab";
import PostsTab from "./PostsTab";
import CommentsTab from "./CommentsTab";
import MessagesTab from "./MessagesTab";
import GroupChatsTab from "./GroupChatsTab";

function AdminPage() {
  return (
    <VerticalTabs initial="dashboard">
      <VerticalTabsButtons>
        <VerticalTabsButton tabName="dashboard">Dashboard</VerticalTabsButton>
        <VerticalTabsButton tabName="users">Users</VerticalTabsButton>
        <VerticalTabsButton tabName="posts">Posts</VerticalTabsButton>
        <VerticalTabsButton tabName="comments">Comments</VerticalTabsButton>
        <VerticalTabsButton tabName="messages">Messages</VerticalTabsButton>
        <VerticalTabsButton tabName="groupChats">
          Group Chats
        </VerticalTabsButton>
      </VerticalTabsButtons>
      <VerticalTabsSection>
        <Tab tabName="dashboard">dash</Tab>
        <Tab tabName="users">
          <UsersTab />
        </Tab>
        <Tab tabName="posts">
          <PostsTab />
        </Tab>
        <Tab tabName="comments">
          <CommentsTab />
        </Tab>
        <Tab tabName="messages">
          <MessagesTab />
        </Tab>
        <Tab tabName="groupChats">
          <GroupChatsTab />
        </Tab>
      </VerticalTabsSection>
    </VerticalTabs>
  );
}

export default AdminPage;
