"use client";

import { useAccount, useSwitchChain, useChainId } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function NetworkSwitcher() {
  const { isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  if (!isConnected) return null;

  const isWrongNetwork = chainId !== baseSepolia.id;

  if (!isWrongNetwork) {
    return null;
  }

  return (
    <Button
      className="gap-2 border-orange-600/20 bg-orange-600/10 text-orange-600 hover:bg-orange-600/20 hover:text-orange-600"
      size="sm"
      variant="outline"
      onClick={() => switchChain?.({ chainId: baseSepolia.id })}
    >
      <AlertCircle className="w-4 h-4" />
      <span className="hidden sm:inline">
        {chain?.name
          ? `Wrong Network (${chain.name})`
          : "Switch to Base Sepolia"}
      </span>
      <span className="sm:hidden">Switch Network</span>
    </Button>
  );
}
