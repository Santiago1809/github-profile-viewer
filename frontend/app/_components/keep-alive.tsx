"use client";

import { useEffect, useRef } from "react";

const FIVE_MINUTES = 5 * 60 * 1000;

export function KeepAlive() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) return;

    const ping = () => {
      fetch(`${baseUrl.replace(/\/+$/, "")}/health`).catch(() => {
        // Backend may be waking up — silence is fine
      });
    };

    // Fire immediately so the backend wakes up on page load
    ping();

    intervalRef.current = setInterval(ping, FIVE_MINUTES);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return null;
}
