import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";
import React from "react";

async function ForbidLoggedIn({ children }: React.PropsWithChildren) {
  const user = await getUser();
  if (user) {
    redirect("/");
  }
  return <>{children}</>;
}

export default ForbidLoggedIn;
