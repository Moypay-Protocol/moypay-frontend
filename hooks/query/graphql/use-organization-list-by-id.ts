import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";

import { urlSubgraph } from "@/lib/constants";
import { OrganizationResponse } from "@/types/graphql/organization.type";
import { queryOrganizationListById } from "@/lib/graphql/organization-lists.query";

export const useOrganizationListById = ({ id }: { id: string }) => {
  const { data, isLoading, error, refetch } = useQuery<OrganizationResponse>({
    queryKey: ["organizationListById", id],
    queryFn: async () => {
      const response = await request<OrganizationResponse>(
        urlSubgraph,
        queryOrganizationListById(id),
      );

      return response;
    },
  });

  return {
    data: data?.organizationList,
    isLoading,
    error,
    refetch: useCallback(() => refetch(), [refetch]),
  };
};
