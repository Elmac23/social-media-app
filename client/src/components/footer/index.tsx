"use client";

import { useDeviceId } from "@/hooks/useDeviceId";
import React from "react";
import Link from "next/link";

function Footer() {
  const deviceId = useDeviceId();
  return (
    <footer className="bg-background-lighter py-8">
      <div className="container mx-auto px-4 text-sm text-muted flex flex-col md:flex-row items-center justify-between gap-4">
        <div>© {new Date().getFullYear()} Friendsy</div>
        <div className="flex items-center gap-4">
          <Link href="/cookies" className="hover:underline">
            Cookies
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
