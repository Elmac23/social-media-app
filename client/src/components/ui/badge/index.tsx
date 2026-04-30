import React from "react";

function Badge({ children }: React.PropsWithChildren) {
  return (
    <p className="px-2 py-1 border-border border-[1px] rounded-2xl inline-block bg-primary-500 text-primary-foreground">
      {children}
    </p>
  );
}

export default Badge;
