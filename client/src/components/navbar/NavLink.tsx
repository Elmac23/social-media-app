import { cn } from "@/lib/cn";
import Link from "next/link";
import React, { ReactNode } from "react";

type NavLinkProps = React.ComponentProps<typeof Link> & {
  icon?: ReactNode;
};

function NavLink({ icon, className, ...props }: NavLinkProps) {
  const linkStyle = cn(
    "text-primary-foreground block py-2 px-4 hover:text-primary transition-colors hover:bg-background/90 hover:text-primary-500 rounded-md text-center flex items-center gap-2",
    className
  );

  if (icon)
    return (
      <Link className={linkStyle} {...props}>
        {icon}
        {props.children}
      </Link>
    );

  return <Link className={linkStyle} {...props} />;
}

export default NavLink;
