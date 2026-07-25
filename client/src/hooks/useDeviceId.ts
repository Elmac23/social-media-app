"use client";
import { createDeviceId } from "@/api/auth";
import { useEffect } from "react";

export function useDeviceId() {
  useEffect(() => {
    async function createDevice() {
      await createDeviceId();
    }
    createDevice();
  }, []);
}
