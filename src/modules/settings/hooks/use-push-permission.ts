"use client";

import { useState } from "react";
import { env } from "@/shared/config/env";
import { savePushSubscription } from "../mutations/save-push-subscription";

const isSupported =
  typeof window !== "undefined" &&
  "Notification" in window &&
  "serviceWorker" in navigator &&
  "PushManager" in window;

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
    if (result !== "granted") return;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(env.vapidPublicKey),
    });

    await savePushSubscription(subscription.toJSON());
  }

  return { permission, requestPermission };
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const buffer = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    buffer[i] = rawData.charCodeAt(i);
  }
  return buffer.buffer;
}
