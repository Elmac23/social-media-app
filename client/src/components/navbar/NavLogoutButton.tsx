"use client";

import React from "react";
import { useLogout } from "@/hooks/useLogout";
import Button from "../ui/Button";
import { MdLogout } from "react-icons/md";

function NavLogoutButton() {
  const logout = useLogout();
  return (
    <Button variant="ghost" onClick={logout} icon={<MdLogout />}>
      Log Out
    </Button>
  );
}

export default NavLogoutButton;
