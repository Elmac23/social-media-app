import { getUserProfileById } from "@/api/users";
import Typography from "@/components/ui/Typography";
import VerticalTabs, {
  Tab,
  VerticalTabsButton,
  VerticalTabsButtons,
  VerticalTabsSection,
} from "@/components/ui/verticalTabs";
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";
import React from "react";
import OvierviewTab from "./OverviewTab";

type AboutPageProps = {
  params: Promise<{ id: string }>;
};

async function AboutPage({ params }: AboutPageProps) {
  const loggedUser = await getUser();

  if (!loggedUser) return redirect("/auth");

  const { id } = await params;

  const userProfile = await getUserProfileById(id, loggedUser.accessToken);
  const { data: profile } = userProfile;

  const isSelf = loggedUser.id === profile.id;

  return (
    <>
      <Typography as="h3" className="font-bold mb-4" size="xl">
        About
      </Typography>

      <VerticalTabs initial="overview">
        <VerticalTabsButtons>
          <VerticalTabsButton tabName="overview">Overview</VerticalTabsButton>
          <VerticalTabsButton tabName="education">Education</VerticalTabsButton>
          <VerticalTabsButton tabName="work">Work</VerticalTabsButton>
          <VerticalTabsButton tabName="relationships">
            Relationships
          </VerticalTabsButton>
        </VerticalTabsButtons>
        <VerticalTabsSection>
          <Tab tabName="overview">
            <OvierviewTab profile={profile} isSelf={isSelf} />
          </Tab>
          <Tab tabName="education">test</Tab>
          <Tab tabName="work">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
            voluptatum, esse eligendi nesciunt dolore corrupti alias optio vitae
            ratione? Adipisci eveniet distinctio molestiae explicabo qui numquam
            eum sit veritatis deleniti.
          </Tab>
          <Tab tabName="relationships">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, eos
            voluptatum placeat enim nesciunt maxime non quasi asperiores nisi
            dolorem atque eveniet error sunt perferendis autem amet commodi
            illum voluptate cum. Alias sit quisquam quod excepturi quia modi
            ipsum? Error?
          </Tab>
        </VerticalTabsSection>
      </VerticalTabs>
    </>
  );
}

export default AboutPage;
