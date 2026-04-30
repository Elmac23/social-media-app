import { getUser } from "@/lib/getUser";

import { getGroupChatById } from "@/api/groupChats";
import DirectChat from "./DirectChatCard";
import GroupChat from "./GroupChatCard";
import VerticalTabs, {
  VerticalTabsButtons,
  VerticalTabsButton,
  VerticalTabsSection,
  Tab,
} from "@/components/ui/verticalTabs";
import groupChat from "./DirectChatCard";
import GroupChatMembers from "./GroupChatMembers";
import GroupChatMessages from "./GroupChatMessages";
import ChatDetailsCard from "./ChatDetailsCard";

type UserDataProps = {
  params: Promise<{ id: string }>;
};

async function GroupChatDataPage({ params }: UserDataProps) {
  const you = await getUser();
  const { id } = await params;
  const groupChatData = await getGroupChatById(id, you?.accessToken);

  return (
    <div className="p-2 grid grid-cols-2 gap-4">
      <ChatDetailsCard chat={groupChatData} />
      <div className="col-span-2">
        {groupChatData.type === "GROUP" && (
          <VerticalTabs initial="members">
            <VerticalTabsButtons>
              <VerticalTabsButton tabName="members">Members</VerticalTabsButton>
              <VerticalTabsButton tabName="messages">
                Messages
              </VerticalTabsButton>
            </VerticalTabsButtons>
            <VerticalTabsSection>
              <Tab tabName="members">
                <GroupChatMembers id={groupChatData.id} />
              </Tab>
              <Tab tabName="messages">
                <GroupChatMessages id={groupChatData.id} />
              </Tab>
            </VerticalTabsSection>
          </VerticalTabs>
        )}

        {groupChatData.type === "DIRECT" && (
          <GroupChatMessages id={groupChatData.id} />
        )}
      </div>
    </div>
  );
}

export default GroupChatDataPage;
