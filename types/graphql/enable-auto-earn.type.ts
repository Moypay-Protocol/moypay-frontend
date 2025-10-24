import { PageInfo } from "./graphql.type";

export type EnableAutoEarnItem = {
  employee: string;
  organization: string;
  id: string;
  amount: string;
  blockNumber: number;
  blockTimestamp: number;
  protocol: string;
  transactionHash: string;
};

export type EnableAutoEarnsResponse = {
  enableAutoEarns: {
    items: EnableAutoEarnItem[];
    pageInfo: PageInfo;
    totalCount: number;
  };
};

export type EnableAutoEarnResponse = {
  enableAutoEarn: EnableAutoEarnItem;
};
