import { useInfiniteQuery } from "@tanstack/react-query";
import { request } from "graphql-request";

import { urlSubgraph } from "@/lib/constants";
import { queryEmployeeListsByEmployee } from "@/lib/graphql/employee-lists.query";
import { EmployeeListsResponse } from "@/types/graphql/employee.type";

export const useEmployeeListsByEmployee = ({
  employeeAddress,
  enabled = true,
}: {
  employeeAddress: string;
  enabled?: boolean;
}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<EmployeeListsResponse>({
    queryKey: ["employeeListsByEmployee", employeeAddress],
    queryFn: async ({ pageParam = null }) => {
      if (!employeeAddress) throw new Error("Address is required");

      return await request<EmployeeListsResponse>(
        urlSubgraph,
        queryEmployeeListsByEmployee(
          employeeAddress,
          pageParam as string | null,
        ),
      );
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.employeeLists.pageInfo.hasNextPage
        ? lastPage.employeeLists.pageInfo.endCursor
        : undefined,
    enabled: !!employeeAddress && enabled,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const allItems =
    data?.pages.flatMap((page) => page.employeeLists.items) ?? [];

  const totalCount = data?.pages[0]?.employeeLists.totalCount ?? 0;
  const pageInfo = data?.pages.at(-1)?.employeeLists.pageInfo;

  return {
    data: allItems[0],
    isLoading: isLoading || isFetchingNextPage,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    fetchAllPages: async () => {
      while (hasNextPage) {
        await fetchNextPage();
      }
    },
    totalCount,
    pageInfo,
    refetch,
  };
};
