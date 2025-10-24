"use client";

import { useSwitchToBaseSepolia } from "@/hooks/use-switch-to-base-sepolia";

export function ChainGuard() {
  useSwitchToBaseSepolia();
  return null;
}
