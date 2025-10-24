import { PageInfo } from "./graphql.type";

export type EmployeeItem = {
  createdAt: number;
  employee: string;
  id: string;
  lastTransaction: string;
  lastUpdated: string;
  organization: string;
  salary: string;
  status: boolean;
  name: string;
  lastCompensationSalary: string;
  lastSalaryUpdated: number;
  lastStatusUpdated: number;
  availableBalance: string;
  currentSalaryBalance: string;
  lastBalanceUpdate: number;
  salaryBalanceTimestamp: number;
  salaryPerSecond: string;
  salaryStreamStartTime: number;
  streamingActive: boolean;
  totalEarned: string;
  totalWithdrawn: string;
  unrealizedSalary: string;
  autoEarnStatus: boolean;
};

export type EmployeeListsResponse = {
  employeeLists: {
    items: EmployeeItem[];
    pageInfo: PageInfo;
    totalCount: number;
  };
};

export type EmployeeResponse = {
  employeeList: EmployeeItem;
};
