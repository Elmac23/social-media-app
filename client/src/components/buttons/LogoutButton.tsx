"use client";

import Button from "@/components/ui/Button";
import React from "react";
import { useLogout } from "../../hooks/useLogout";

function LogoutButton() {
  const logout = useLogout();
  return <Button onClick={logout}>Log Out</Button>;
}

export default LogoutButton;
