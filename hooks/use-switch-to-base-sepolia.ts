import { useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { baseSepolia } from "wagmi/chains";

export const useSwitchToBaseSepolia = () => {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();

  const isWrongNetwork = chain && chain.id !== baseSepolia.id;

  useEffect(() => {
    if (isWrongNetwork && switchChain) {
      switchChain({ chainId: baseSepolia.id });
    }
  }, [isWrongNetwork, switchChain]);

  return {
    isWrongNetwork,
    switchToBaseSepolia: () => switchChain?.({ chainId: baseSepolia.id }),
  };
};
