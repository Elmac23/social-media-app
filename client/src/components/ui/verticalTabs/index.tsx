"use client";

import React from "react";
import Card from "../Card";
import { cn } from "@/lib/cn";
import NavLink from "@/components/navbar/NavLink";
import { useSearchParams } from "next/navigation";

const tabContext = React.createContext<{
  tab: string | null;
}>({ tab: null });

function useTabContext() {
  return React.useContext(tabContext);
}

export function VerticalTabsSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grow p-2">{children}</div>;
}

export function VerticalTabsButtons({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 pr-4 border-r-2 border-background/30">
      {children}
    </div>
  );
}
export function VerticalTabsButton({
  children,
  tabName,
}: {
  children: React.ReactNode;
  tabName: string;
}) {
  const { tab } = useTabContext();
  return (
    <NavLink
      href={`?tab=${tabName}`}
      className={cn(
        "text-left block w-full",
        tabName === tab && "text-primary-500"
      )}
    >
      {children}
    </NavLink>
  );
}

function VerticalTabs({
  children,
  initial,
}: {
  children: React.ReactNode;
  initial?: string;
}) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  return (
    <Card className="flex gap-4">
      <tabContext.Provider value={{ tab: tab || initial || null }}>
        {children}
      </tabContext.Provider>
    </Card>
  );
}

export function Tab({
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
}

export default VerticalTabs;
