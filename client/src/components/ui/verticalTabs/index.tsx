"use client";

import { memo, useId } from "react";
import Card from "../Card";
import { cn } from "@/lib/cn";
import NavLink from "@/components/navbar/NavLink";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

const tabContext = React.createContext<{
  tab: string | null;
  id: string;
}>({ tab: null, id: "" });

function useTabContext() {
  return React.useContext(tabContext);
}

export const VerticalTabsSection = memo(function VerticalTabsSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grow p-4">{children}</div>;
});

export const VerticalTabsButtons = memo(function VerticalTabsButtons({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 border-b-[1px] lg:border-b-0 lg:border-r-[1px] border-border rounded-t-lg lg:rounded-tr-none lg:rounded-l-lg bg-background-lighter">
      <div className="lg:self-start lg:sticky lg:top-20 space-y-2">
        {children}
      </div>
    </div>
  );
});

type VerticalTabsButtonProps = React.PropsWithChildren<{
  tabName?: string;
  href?: string;
}>;

export const VerticalTabsButton = memo(function VerticalTabsButton({
  children,
  tabName,
  href,
}: VerticalTabsButtonProps) {
  const { tab, id } = useTabContext();
  if (tabName && href)
    throw new Error("Vertical tabs button cant have both tabName and href");
  const url = (href ?? `?tab=${tabName}`) + `#${id}`;
  const pathname = usePathname();
  const isActive = tabName === tab || href === pathname;

  return (
    <NavLink
      href={url}
      className={cn("text-left block w-max", isActive && "text-primary-500")}
    >
      {children}
    </NavLink>
  );
});

const VerticalTabs = memo(function VerticalTabs({
  children,
  initial,
}: {
  children: React.ReactNode;
  initial?: string;
}) {
  console.log("render");
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const id = useId();
  return (
    <Card className="flex relative flex-col lg:flex-row p-0 bg-background">
      <tabContext.Provider value={{ tab: tab || initial || null, id }}>
        {children}
      </tabContext.Provider>
    </Card>
  );
});

export const Tab = memo(function Tab({
  children,
  tabName,
}: {
  children: React.ReactNode;
  tabName: string;
}) {
  const { tab } = useTabContext();
  const isActive = tab === tabName;

  if (!isActive) return null;

  return <>{children}</>;
});

export default VerticalTabs;
