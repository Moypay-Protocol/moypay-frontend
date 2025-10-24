import { PageInfo } from "./graphql.type";

export type OrganizationItem = {
  activeEmployees: number;
  countDeposits: number;
  countWithdraws: number;
  createdAt: number;
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

export type OrganizationListsResponse = {
  organizationLists: {
    items: OrganizationItem[];
    pageInfo: PageInfo;
    totalCount: number;
  };
};

export type OrganizationResponse = {
  organizationList: OrganizationItem;
};
