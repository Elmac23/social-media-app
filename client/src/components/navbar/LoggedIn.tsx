import React from "react";
import NavLink from "./NavLink";
import Avatar from "../ui/Avatar";
import { User } from "@/types/user";
import Dropdown from "../ui/dropdown";
import DropdownTrigger from "../ui/dropdown/DropdownTrigger";
import DropdownBody from "../ui/dropdown/DropdownBody";
import NavLogoutButton from "./NavLogoutButton";
import Button from "../ui/Button";
import {
  MdAccountCircle,
  MdChat,
  MdGroup,
  MdHome,
  MdSettings,
} from "react-icons/md";
import { getAvatarUrl } from "@/lib/getAvatarUrl";

export type LoggedInProps = {
  user: User;
};

function LoggedIn({ user }: LoggedInProps) {
  const avatarUrl = getAvatarUrl(user.avatarUrl);
  const displayedName = `${user.name} ${user.lastname}`;
  return (
    <>
      <li>
        <NavLink href="/feed" icon={<MdHome />}>
          Browse
        </NavLink>
      </li>
      <li>
        <NavLink icon={<MdChat />} href="/">
          Chat
        </NavLink>
      </li>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="ghost" className="flex items-center gap-2">
            {displayedName}
            <Avatar url={avatarUrl} alt={displayedName} />
          </Button>
        </DropdownTrigger>
        <DropdownBody className="space-y-2 divide-y-2 divide-background/30 right-0 mt-8">
          <NavLink href={`/profile/${user.id}`} icon={<MdAccountCircle />}>
            Profile
          </NavLink>
          <NavLink href="/friends" icon={<MdGroup />}>
            Friends
          </NavLink>
          <NavLink href="/settings" icon={<MdSettings />}>
            Settings
          </NavLink>
          <NavLogoutButton />
        </DropdownBody>
      </Dropdown>
    </>
  );
}

export default LoggedIn;
