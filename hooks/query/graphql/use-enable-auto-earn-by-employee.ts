import { useInfiniteQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { useAccount } from "wagmi";

import { urlSubgraph } from "@/lib/constants";
import { queryEnableAutoEarnsByEmployee } from "@/lib/graphql/enable-auto-earn.query";
import { EnableAutoEarnsResponse } from "@/types/graphql/enable-auto-earn.type";

export const useEnableAutoEarnsByEmployee = ({
  employeeAddress,
}: {
  employeeAddress: string;
}) => {
  const { address: userAddress } = useAccount();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<EnableAutoEarnsResponse>({
    queryKey: ["enableAutoEarnsByEmployee", employeeAddress],
    queryFn: async ({ pageParam = null }) => {
      if (!userAddress || !employeeAddress)
        throw new Error("Address is required");

      return await request<EnableAutoEarnsResponse>(
        urlSubgraph,
        queryEnableAutoEarnsByEmployee(
          employeeAddress,
          pageParam as string | null,
        ),
      );
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.enableAutoEarns.pageInfo.hasNextPage
        ? lastPage.enableAutoEarns.pageInfo.endCursor
        : undefined,
    enabled: !!userAddress && !!employeeAddress,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const allItems =
    data?.pages.flatMap((page) => page.enableAutoEarns.items) ?? [];

  const totalCount = data?.pages[0]?.enableAutoEarns.totalCount ?? 0;
  const pageInfo = data?.pages.at(-1)?.enableAutoEarns.pageInfo;

  const fetchAllPages = async () => {
    while (hasNextPage) {
      await fetchNextPage();
    }
  };

  return {
    data: allItems[0],
    isLoading: isLoading || isFetchingNextPage,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    fetchAllPages,
    totalCount,
    pageInfo,
    refetch,
  };
};
