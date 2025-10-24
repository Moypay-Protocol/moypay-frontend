"use client";

import { ArrowUp, Coins } from "lucide-react";

import { WithdrawTabs } from "../tabs/withdraw-tabs";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type WithdrawDialogProps = {
  balance: string;
  organizationAddress: string;
  onSuccess?: () => void;
};

export default function WithdrawDialog({
  balance,
  organizationAddress,
  onSuccess,
}: WithdrawDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-1 flex items-center justify-center gap-1">
          <ArrowUp className="w-5 h-5" />
          <span className="ml-2">Withdraw</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins /> Withdraw
          </DialogTitle>
          <DialogDescription>
            ⚠️ Minimum withdrawal amount is $5
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-full max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-full">
            <WithdrawTabs
              balance={balance}
              organizationAddress={organizationAddress}
              onSuccess={onSuccess}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
