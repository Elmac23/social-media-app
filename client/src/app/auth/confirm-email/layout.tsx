import React from "react";
import ForbidLoggedIn from "../ForbidLoggedIn";

async function ConfirmEmailLayout({ children }: React.PropsWithChildren) {
  return (
    <main className="max-w-[700px] mx-auto p-8 ">
      <ForbidLoggedIn>{children}</ForbidLoggedIn>
    </main>
  );
}

export default ConfirmEmailLayout;
