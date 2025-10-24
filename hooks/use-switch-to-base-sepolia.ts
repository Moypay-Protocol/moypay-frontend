import { useAccount, useSwitchChain } from "wagmi";
import { baseSepolia } from "wagmi/chains";

export const useSwitchToBaseSepolia = () => {
  const { chain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();

  const isWrongNetwork = isConnected && chain && chain.id !== baseSepolia.id;

  return {
    isWrongNetwork,
    switchToBaseSepolia: () => switchChain?.({ chainId: baseSepolia.id }),
  };
};
