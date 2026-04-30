import VerticalTabs, {
  VerticalTabsButtons,
  VerticalTabsButton,
  VerticalTabsSection,
} from "@/components/ui/verticalTabs";
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";
import React from "react";

async function AdminLayout({ children }: React.PropsWithChildren) {
  const user = await getUser();
  if (!user) return redirect("/");

  if (user.role !== "ADMIN") return redirect("/");
  return (
    <main className="max-w-[1500px] mx-auto p-8 ">
      <VerticalTabs>
        <VerticalTabsButtons>
          <VerticalTabsButton href="/admin">Dashboard</VerticalTabsButton>
          <VerticalTabsButton href="/admin/users">Users</VerticalTabsButton>
          <VerticalTabsButton href="/admin/posts">Posts</VerticalTabsButton>
          <VerticalTabsButton href="/admin/comments">
            Comments
          </VerticalTabsButton>
          <VerticalTabsButton href="/admin/messages">
            Messages
          </VerticalTabsButton>
          <VerticalTabsButton href="/admin/group-chats">
            Group Chats
          </VerticalTabsButton>
        </VerticalTabsButtons>
        <VerticalTabsSection>{children}</VerticalTabsSection>
      </VerticalTabs>
    </main>
  );
}

export default AdminLayout;
