import { useReadContract } from "wagmi";

import { OrganizationABI } from "@/lib/abis/organization.abi";
import { normalize } from "@/lib/helper/bignumber";

export const useCurrentSalary = ({
  organizationAddress,
  employeeAddress,
}: {
  organizationAddress: HexAddress;
  employeeAddress: HexAddress;
}) => {
  const { data, isLoading, refetch } = useReadContract({
    address: organizationAddress,
    abi: OrganizationABI,
    functionName: "_currentSalary",
    args: [employeeAddress],
    query: {
      enabled: !!organizationAddress && !!employeeAddress,
      refetchInterval: 3_000,
    },
  });

  const currentSalary = data
    ? parseFloat(normalize(Number(data), 18)).toFixed(3)
    : "0.00";

  return {
    currentSalary,
    isLoading,
    refetch,
  };
};
