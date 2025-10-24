import { gql } from "graphql-request";

export const queryOrganizationListsByOwner = (
  owner: string,
  after: string | null = null,
) => {
  return gql`
    query {
      organizationLists(
        orderBy: "createdAt"
        orderDirection: "desc"
        where: {owner: "${owner}"}
        ${after ? `after: "${after}"` : ""}
      ){
        items {
          activeEmployees
          countDeposits
          countWithdraws
          createdAt
          id
          lastTransaction
          lastUpdated
          organization
          owner
          periodTime
          token
          totalDeposits
          totalEmployees
          totalWithdrawals
          currentBalance
          shortfall
          totalSalary
          name
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

export const queryOrganizationListById = (id: string) => {
  return gql`
    query {
      organizationList(id: "${id}"){
        activeEmployees
        countDeposits
        countWithdraws
        createdAt
        id
        lastTransaction
        lastUpdated
        organization
        owner
        periodTime
        token
        totalDeposits
        totalEmployees
        totalWithdrawals
        currentBalance
        shortfall
        totalSalary
        name
      }
    }
  `;
};
