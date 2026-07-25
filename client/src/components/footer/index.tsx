import React from "react";
import Link from "next/link";
import LanguageSelect from "../LanguageSelect";
import { getLocale, getTranslations } from "next-intl/server";

async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("Footer");
  return (
    <footer className="bg-background-lighter py-8">
      <div className="container mx-auto px-4 text-sm text-muted flex flex-col md:flex-row items-center justify-between gap-4">
        <div>© {new Date().getFullYear()} Friendsy</div>
        <div className="flex items-center gap-4">
          <LanguageSelect currentLocale={locale} />
          <Link href="/cookies" className="hover:underline">
            {t("cookies")}
          </Link>
          <Link href="/terms" className="hover:underline">
            {t("termsOfUse")}
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
