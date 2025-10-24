import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";

import { urlSubgraph } from "@/lib/constants";
import { queryOrganizationJoinedListById } from "@/lib/graphql/organization-joined-lists.query";
import { OrganizationJoinedResponse } from "@/types/graphql/organization-joined.type";

export const useOrganizationJoinedListById = ({ id }: { id: string }) => {
  const { data, isLoading, error, refetch } =
    useQuery<OrganizationJoinedResponse>({
      queryKey: ["organizationJoinedListById", id],
      queryFn: async () => {
        const response = await request<OrganizationJoinedResponse>(
          urlSubgraph,
          queryOrganizationJoinedListById(id),
        );

        return response;
      },
    });

  return {
    data: data?.organizationJoinedList,
    isLoading,
    error,
    refetch: useCallback(() => refetch(), [refetch]),
  };
};
