import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";

import { urlSubgraph } from "@/lib/constants";
import { queryEmployeeListById } from "@/lib/graphql/employee-lists.query";
import { EmployeeResponse } from "@/types/graphql/employee.type";

export const useEmployeeListById = ({ id }: { id: string }) => {
  const { data, isLoading, error, refetch } = useQuery<EmployeeResponse>({
    queryKey: ["employeeListById", id],
    queryFn: async () => {
      const response = await request<EmployeeResponse>(
        urlSubgraph,
        queryEmployeeListById(id),
      );

      return response;
    },
  });

  return {
    data: data?.employeeList,
    isLoading,
    error,
    refetch: useCallback(() => refetch(), [refetch]),
  };
};
