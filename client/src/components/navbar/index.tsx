import Link from "next/link";
import React from "react";
import { getUser } from "@/lib/getUser";
import Typography from "../ui/Typography";
import SearchUsers from "../search";
import NavbarCollapse from "./NavbarCollapse";

async function Navbar() {
  const user = await getUser();

  return (
    <div className="bg-background-lighter border-b-[1px] border-border shadow-2xl w-full z-50 fixed top-0 overflow-y-hidden lg:overflow-y-visible">
      <div className="flex p-4 lg:pb-4 pb-0 flex-col lg:flex-row justify-between lg:items-center gap-2 lg:gap-4 container mx-auto ">
        <div className="flex justify-center lg:justify-start text-center mb-4 lg:mb-0 gap-12 flex-1">
          <Typography as="h2" size="2xl" className="font-bold">
            <Link href="/">Friendsy</Link>
          </Typography>
          <div className="hidden lg:block">{user && <SearchUsers />}</div>
        </div>
        <NavbarCollapse user={user} />
      </div>
    </div>
  );
}

export default Navbar;
