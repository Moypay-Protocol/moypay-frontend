import { useInfiniteQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { useAccount } from "wagmi";

import { urlSubgraph } from "@/lib/constants";
import { WithdrawsResponse } from "@/types/graphql/withdraw.type";
import { queryWithdrawsByEmployee } from "@/lib/graphql/withdraws.query";

export const useWithdrawsByEmployee = ({ employee }: { employee: string }) => {
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
  } = useInfiniteQuery<WithdrawsResponse>({
    queryKey: ["withdrawsByEmployee", userAddress, employee],
    queryFn: async ({ pageParam = null }) => {
      if (!userAddress || !employee)
        throw new Error("Address and employee are required");

      return await request<WithdrawsResponse>(
        urlSubgraph,
        queryWithdrawsByEmployee(employee, pageParam as string | null),
      );
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.withdraws.pageInfo.hasNextPage
        ? lastPage.withdraws.pageInfo.endCursor
        : undefined,
    enabled: !!userAddress && !!employee,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const allItems = data?.pages.flatMap((page) => page.withdraws.items) ?? [];

  const totalCount = data?.pages[0]?.withdraws.totalCount ?? 0;
  const pageInfo = data?.pages.at(-1)?.withdraws.pageInfo;

  const fetchAllPages = async () => {
    while (hasNextPage) {
      await fetchNextPage();
    }
  };

  return {
    data: allItems,
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
