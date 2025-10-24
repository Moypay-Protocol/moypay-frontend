import { useAccount, useReadContract } from "wagmi";

import { normalize } from "@/lib/helper/bignumber";
import { ProtocolABI } from "@/lib/abis/protocol.abi";

export const useBalanceStaked = ({
  protocolAddress,
}: {
  protocolAddress: HexAddress;
}) => {
  const { address: userAddress } = useAccount();

  const { data, isLoading, refetch } = useReadContract({
    address: protocolAddress,
    abi: ProtocolABI,
    functionName: "userShares",
    args: [userAddress as HexAddress],
    query: {
      enabled: !!protocolAddress && !!userAddress,
      refetchInterval: 3_000,
    },
  });

  const stakedAmount = data
    ? parseFloat(normalize(Number(data), 18)).toFixed(2)
    : "0.00";

  return {
    stakedAmount,
    isLoading,
    refetch,
  };
};
