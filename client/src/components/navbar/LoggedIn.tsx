import NavLink from "./NavLink";
import Avatar from "../ui/Avatar";
import { UserWithToken } from "@/types/user";
import Dropdown from "../ui/dropdown";
import DropdownTrigger from "../ui/dropdown/DropdownTrigger";
import DropdownBody from "../ui/dropdown/DropdownBody";
import NavLogoutButton from "./NavLogoutButton";
import Button from "../ui/Button";
import {
  MdAccountCircle,
  MdChat,
  MdDashboard,
  MdGroup,
  MdHome,
  MdSettings,
} from "react-icons/md";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import Notifications from "../notifications";
import SearchUsers from "../search";

export type LoggedInProps = {
  user: UserWithToken;
  hideMenu: () => void;
};

function LoggedIn({ user, hideMenu }: LoggedInProps) {
  const avatarUrl = getAvatarUrl(user.avatarUrl);
  const displayedName = `${user.name} ${user.lastname}`;
  const isAdmin = user.role === "ADMIN";
  return (
    <>
      <li onClick={hideMenu}>
        <NavLink className="flex justify-center" href="/feed" icon={<MdHome />}>
          Browse
        </NavLink>
      </li>
      <li onClick={hideMenu}>
        <NavLink icon={<MdChat />} href="/chat" className="flex justify-center">
          Chat
        </NavLink>
      </li>

      <Notifications />

      <li className="lg:hidden">
        <SearchUsers />
      </li>

      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="ghost"
            className="flex items-center gap-2 w-full lg:w-auto justify-center"
          >
            {displayedName}
            <Avatar url={avatarUrl} alt={displayedName} />
          </Button>
        </DropdownTrigger>
        <DropdownBody className="space-y-2 divide-y-2 divide-background/30 lg:right-0 lg:top-auto top-90 lg:mt-8 h-min lg:h-auto">
          {isAdmin && (
            <NavLink href={`/admin`} icon={<MdDashboard />}>
              Dashboard
            </NavLink>
          )}
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
