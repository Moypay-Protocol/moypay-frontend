import { PageInfo } from "./graphql.type";

export type OrganizationJoinedItem = {
  activeEmployees: number;
  countDeposits: number;
  countWithdraws: number;
  createdAt: number;
  employee: string;
  id: string;
  lastTransaction: string;
  lastUpdated: number;
  organization: string;
  owner: string;
  periodTime: string;
  token: string;
  totalDeposits: string;
  totalEmployees: number;
  totalWithdrawals: string;
  currentBalance: string;
  shortfall: string;
  totalSalary: string;
  name: string;
};

export type OrganizationJoinedListsResponse = {
  organizationJoinedLists: {
    items: OrganizationJoinedItem[];
    pageInfo: PageInfo;
    totalCount: number;
  };
};

export type OrganizationJoinedResponse = {
  organizationJoinedList: OrganizationJoinedItem;
};
