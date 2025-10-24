import { gql } from "graphql-request";

export const queryWithdrawsByEmployee = (
  employee: string,
  after: string | null = null,
) => {
  return gql`
    query {
      withdraws(
        orderBy: "blockTimestamp"
        orderDirection: "desc"
        where: {employee: "${employee}"}
        ${after ? `after: "${after}"` : ""}
      ){
        items {
          amount
          blockNumber
          blockTimestamp
          employee
          id
          isOfframp
          organization
          startStream
          transactionHash
          unrealizedSalary
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

export const queryWithdrawById = (id: string) => {
  return gql`
    query {
      withdraw(id: "${id}"){
        amount
        blockNumber
        blockTimestamp
        employee
        id
        isOfframp
        organization
        startStream
        transactionHash
        unrealizedSalary
      }
    }
  `;
};
