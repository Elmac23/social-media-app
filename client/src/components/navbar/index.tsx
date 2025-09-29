import Link from "next/link";
import React from "react";
import NavLink from "./NavLink";
import { getUser } from "@/lib/getUser";
import LoggedIn from "./LoggedIn";

async function Navbar() {
  const user = await getUser();

  return (
    <div className="bg-background-lighter border-b-2 border-black/40 shadow-2xl w-full z-50 fixed top-0">
      <div className="flex p-4 justify-between items-center gap-4 container mx-auto ">
        <h1 className="text-2xl font-bold">
          <Link href="/">MyApp</Link>
        </h1>
        <nav>
          <ul className="flex items-center gap-8">
            {user && <LoggedIn user={user} />}

            {!user && (
              <>
                <li>
                  <NavLink
                    className="hover:text-primary-foreground bg-primary-500 hover:bg-primary-900"
                    href="/auth/login"
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/auth/register">Register</NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
