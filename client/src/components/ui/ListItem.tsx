import { cn } from "@/lib/cn";
import React from "react";

type ListItemProps = React.PropsWithChildren<{
  className?: string;
}>;

function ListItem({ className, children }: ListItemProps) {
  const styles = cn("flex items-center p-2", className);
  return <li className={styles}>{children}</li>;
}

export default ListItem;
