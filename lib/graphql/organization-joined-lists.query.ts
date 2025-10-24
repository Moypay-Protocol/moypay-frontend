import { gql } from "graphql-request";

export const queryOrganizationJoinedListsByEmployee = (
  employee: string,
  after: string | null = null,
) => {
  return gql`
    query {
      organizationJoinedLists(
        orderBy: "createdAt"
        orderDirection: "desc"
        where: {employee: "${employee}"}
        ${after ? `after: "${after}"` : ""}
      ){
        items {
          activeEmployees
          countDeposits
          countWithdraws
          createdAt
          currentBalance
          employee
          id
          lastTransaction
          lastUpdated
          organization
          owner
          periodTime
          shortfall
          token
          totalDeposits
          totalEmployees
          totalSalary
          totalWithdrawals
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

export const queryOrganizationJoinedListById = (id: string) => {
  return gql`
    query {
      organizationJoinedList(id: "${id}"){
        activeEmployees
        countDeposits
        countWithdraws
        createdAt
        currentBalance
        employee
        id
        lastTransaction
        lastUpdated
        organization
        owner
        periodTime
        shortfall
        token
        totalDeposits
        totalEmployees
        totalSalary
        totalWithdrawals
        name
      }
    }
  `;
};
