"use client";

import { UserWithToken } from "@/types/user";
import LoggedIn from "./LoggedIn";
import NavLink from "./NavLink";
import IconButton from "../ui/IconButton";
import { MdClose, MdMenu } from "react-icons/md";
import { useToggle } from "@/hooks/useToggle";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";

type NavbarCollapseProps = {
  user?: UserWithToken;
};

function NavbarCollapse({ user }: NavbarCollapseProps) {
  const width = window.innerWidth;
  const isPC = width > 1000;

  const { setFalse, toggle, value: isVisible } = useToggle(isPC);

  const closeMenu = () => {
    if (!isPC) setFalse();
  };

  const t = useTranslations("Header");

  return (
    <>
      <IconButton
        onClick={toggle}
        size="large"
        className="lg:hidden fixed top-3 right-4 size-12 text-2xl"
      >
        <AnimatePresence mode="wait">
          {isVisible ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <MdClose />
            </motion.div>
          ) : (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <MdMenu />
            </motion.div>
          )}
        </AnimatePresence>
      </IconButton>

      <AnimatePresence>
        <motion.nav
          initial={{
            height: isVisible ? "auto" : 0,
          }}
          animate={{ height: isVisible ? "auto" : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <ul className="flex lg:items-center items-stretch flex-col lg:flex-row gap-4 lg:gap-8 lg:pb-0 pb-4">
            {user && <LoggedIn hideMenu={closeMenu} user={user} />}

            {!user && (
              <>
                <li>
                  <NavLink
                    className="text-primary-foreground bg-primary-500 hover:bg-primary-900 hover:text-primary-foreground"
                    href="/auth/login"
                  >
                    {t("login")}
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/auth/register">{t("register")}</NavLink>
                </li>
              </>
            )}
          </ul>
        </motion.nav>
      </AnimatePresence>
    </>
  );
}

export default NavbarCollapse;
