"use client";

import React from "react";
import { useLogout } from "@/hooks/useLogout";
import Button from "../ui/Button";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { clearSearches } from "@/store/searches";
import { useTranslations } from "next-intl";

function NavLogoutButton() {
  const logout = useLogout();
  const dispatch = useDispatch();
  const t = useTranslations("Header");
  function onLogout() {
    dispatch(clearSearches());
    logout();
  }
  return (
    <Button variant="ghost" onClick={onLogout} icon={<MdLogout />}>
      {t("logOut")}
    </Button>
  );
}

export default NavLogoutButton;
