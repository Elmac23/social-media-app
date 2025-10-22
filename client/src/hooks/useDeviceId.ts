"use client";

import { v4 as uuid } from "uuid";
import { useLocalStorage } from "./useLocalStorage";

export function useDeviceId() {
  const initialId = uuid();

  const [deviceId, setDeviceId] = useLocalStorage<string>(
    "deviceId",
    initialId
  );
  return deviceId;
}
