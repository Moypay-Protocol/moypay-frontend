import { useAccount, useSwitchChain, useChainId } from "wagmi";
import { baseSepolia } from "wagmi/chains";

export const useSwitchToBaseSepolia = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const isWrongNetwork = isConnected && chainId !== baseSepolia.id;

  return {
    isWrongNetwork,
    switchToBaseSepolia: () => switchChain?.({ chainId: baseSepolia.id }),
  };
};
