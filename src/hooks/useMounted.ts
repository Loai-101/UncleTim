"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => undefined;

/**
 * Returns true only after the component has hydrated on the client.
 * Uses useSyncExternalStore to avoid effect-based setState cascading renders.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
