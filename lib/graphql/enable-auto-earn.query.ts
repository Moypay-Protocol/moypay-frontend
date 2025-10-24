import { gql } from "graphql-request";

export const queryEnableAutoEarnsByEmployee = (
  employee: string,
  after: string | null = null,
) => {
  return gql`
    query {
      enableAutoEarns(
        orderBy: "blockTimestamp"
        orderDirection: "desc"
        where: {employee: "${employee}"}
        ${after ? `after: "${after}"` : ""}
      ){
        items {
          employee
          organization
          id
          amount
          blockNumber
          blockTimestamp
          protocol
          transactionHash
        }
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        totalCount
      }
    }
  `;
};

export const queryEnableAutoEarnById = (id: string) => {
  return gql`
    query {
      enableAutoEarn(id: "${id}"){
        employee
        organization
        id
        amount
        blockNumber
        blockTimestamp
        protocol
        transactionHash
      }
    }
  `;
};
