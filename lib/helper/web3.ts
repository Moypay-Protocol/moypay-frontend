export const urlExplorer = ({
  chainId,
  address,
  txHash,
}: {
  chainId: ChainSupported;
  address?: string;
  txHash?: string;
}) => {
  const chainMetaMap: {
    [key: number]: {
      explorer: string;
    };
  } = {
    84532: {
      explorer: "https://sepolia.basescan.org",
    },
  };

  const chainMeta = chainMetaMap[chainId];

  if (!chainMeta) return "";

  if (address) {
    return `${chainMeta.explorer}/address/${address}`;
  }

  if (txHash) {
    return `${chainMeta.explorer}/tx/${txHash}`;
  }

  return "";
};

export const formatAddress = (address: string, sliceLength: number = 6) => {
  if (!address) return "No address";

  return `${address.slice(0, sliceLength)}...${address.slice(-sliceLength)}`;
};
