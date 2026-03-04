"use client";

import { useState } from "react";

const isSupported = typeof window !== "undefined" && "Notification" in window;

type PushPermissionState = {
  permission: NotificationPermission | "unsupported";
  requestPermission: () => Promise<void>;
};

export function usePushPermission(): PushPermissionState {
  const [permission, setPermission] = useState<
    NotificationPermission | "unsupported"
  >(isSupported ? Notification.permission : "unsupported");

  async function requestPermission() {
    if (!isSupported) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }

  return { permission, requestPermission };
}
