import { useInfiniteQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { useAccount } from "wagmi";

import { urlSubgraph } from "@/lib/constants";
import { queryOrganizationJoinedListsByEmployee } from "@/lib/graphql/organization-joined-lists.query";
import { OrganizationJoinedListsResponse } from "@/types/graphql/organization-joined.type";

export const useOrganizationJoinedListsByEmployee = () => {
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
  } = useInfiniteQuery<OrganizationJoinedListsResponse>({
    queryKey: ["organizationJoinedListsByEmployee", userAddress],
    queryFn: async ({ pageParam = null }) => {
      if (!userAddress) throw new Error("Address is required");

      return await request<OrganizationJoinedListsResponse>(
        urlSubgraph,
        queryOrganizationJoinedListsByEmployee(
          userAddress,
          pageParam as string | null,
        ),
      );
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.organizationJoinedLists.pageInfo.hasNextPage
        ? lastPage.organizationJoinedLists.pageInfo.endCursor
        : undefined,
    enabled: !!userAddress,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const allItems =
    data?.pages.flatMap((page) => page.organizationJoinedLists.items) ?? [];

  const totalCount = data?.pages[0]?.organizationJoinedLists.totalCount ?? 0;
  const pageInfo = data?.pages.at(-1)?.organizationJoinedLists.pageInfo;

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
