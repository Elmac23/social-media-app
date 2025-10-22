"use client";

import { useDeviceId } from "@/hooks/useDeviceId";
import React from "react";

function Footer() {
  const deviceId = useDeviceId();
  return (
    <div className="bg-background-lighter py-20">
      WORK IN PROGRESS {deviceId}
    </div>
  );
}

export default Footer;
