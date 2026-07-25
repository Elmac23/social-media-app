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
import { useTranslations } from "next-intl";

export type LoggedInProps = {
  user: UserWithToken;
  hideMenu: () => void;
};

function LoggedIn({ user, hideMenu }: LoggedInProps) {
  const avatarUrl = getAvatarUrl(user.avatarUrl);
  const displayedName = `${user.name} ${user.lastname}`;
  const isAdmin = user.role === "ADMIN";

  const t = useTranslations("Header");
  return (
    <>
      <li onClick={hideMenu}>
        <NavLink className="flex justify-center" href="/feed" icon={<MdHome />}>
          {t("browse")}
        </NavLink>
      </li>
      <li onClick={hideMenu}>
        <NavLink icon={<MdChat />} href="/chat" className="flex justify-center">
          {t("chat")}
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
        <DropdownBody className="space-y-2 divide-y-2 w-max divide-background/30 lg:right-0 lg:top-auto top-90 lg:mt-8 h-min lg:h-auto">
          {isAdmin && (
            <NavLink href={`/admin`} icon={<MdDashboard />}>
              {t("dashboard")}
            </NavLink>
          )}
          <NavLink href={`/profile/${user.id}`} icon={<MdAccountCircle />}>
            {t("profile")}
          </NavLink>
          <NavLink href="/friends" icon={<MdGroup />}>
            {t("friends")}
          </NavLink>
          <NavLink href="/settings" icon={<MdSettings />}>
            {t("settings")}
          </NavLink>
          <NavLogoutButton />
        </DropdownBody>
      </Dropdown>
    </>
  );
}

export default LoggedIn;
