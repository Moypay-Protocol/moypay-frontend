import { useInfiniteQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { useAccount } from "wagmi";

import { urlSubgraph } from "@/lib/constants";
import { OrganizationListsResponse } from "@/types/graphql/organization.type";
import { queryOrganizationListsByOwner } from "@/lib/graphql/organization-lists.query";

export const useOrganizationListsByOwner = () => {
  const { address: userAddress } = useAccount();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<OrganizationListsResponse>({
    queryKey: ["organizationListsByOwner", userAddress],
    queryFn: async ({ pageParam = null }) => {
      if (!userAddress) throw new Error("Address is required");

      return request<OrganizationListsResponse>(
        urlSubgraph,
        queryOrganizationListsByOwner(userAddress, pageParam as string | null),
      );
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.organizationLists.pageInfo.hasNextPage
        ? lastPage.organizationLists.pageInfo.endCursor
        : undefined,
    enabled: !!userAddress,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const allItems =
    data?.pages.flatMap((page) => page.organizationLists.items) || [];

  const totalCount =
    data?.pages[data.pages.length - 1]?.organizationLists.totalCount ?? 0;

  const pageInfo =
    data?.pages[data.pages.length - 1]?.organizationLists.pageInfo;

  return {
    data: allItems,
    totalCount,
    pageInfo,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  };
};
