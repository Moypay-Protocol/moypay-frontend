import { PageInfo } from "./graphql.type";

export type WithdrawItem = {
  amount: string;
  blockNumber: number;
  blockTimestamp: number;
  employee: string;
  id: string;
  isOfframp: boolean;
  organization: string;
  startStream: boolean;
  transactionHash: string;
  unrealizedSalary: string;
};

export type WithdrawsResponse = {
  withdraws: {
    items: WithdrawItem[];
    pageInfo: PageInfo;
    totalCount: number;
  };
};

export type WithdrawResponse = {
  withdraw: WithdrawItem;
};
