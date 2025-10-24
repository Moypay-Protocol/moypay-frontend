import { WithdrawDialogProps } from "../dialog/withdraw-dialog";

import { WalletTab } from "./wallet-tab";
import { OffRampTab } from "./offramp-tab";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function WithdrawTabs({
  balance,
  organizationAddress,
  onSuccess,
}: WithdrawDialogProps) {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Tabs className="rounded-xl" defaultValue="wallet">
        <TabsList className="w-full">
          <TabsTrigger value="wallet">Send To Wallet</TabsTrigger>
          <TabsTrigger value="offramp">Withdraw To Bank</TabsTrigger>
        </TabsList>
        <WalletTab
          balance={balance}
          organizationAddress={organizationAddress}
          onSuccess={onSuccess}
        />
        <OffRampTab
          balance={balance}
          organizationAddress={organizationAddress}
          onSuccess={onSuccess}
        />
      </Tabs>
    </div>
  );
}
