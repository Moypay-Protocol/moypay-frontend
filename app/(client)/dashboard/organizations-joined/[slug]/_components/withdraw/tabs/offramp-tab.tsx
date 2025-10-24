"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AlertCircle, Fuel, Pencil, Trash2 } from "lucide-react";

import { WithdrawlDialog } from "../dialog/withdrawl-dialog";
import { WithdrawDialogProps } from "../dialog/withdraw-dialog";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { formatNumberWithComma } from "@/lib/helper/formatted";
import { useWithdrawOrganization } from "@/hooks/mutation/contract/use-withdraw-organization";
import TransactionDialog from "@/components/dialog/dialog-transactions";
import { cn } from "@/lib/utils";
import { formatCompactNumber } from "@/lib/helper/number";

export const OffRampTab = ({
  balance,
  organizationAddress,
  onSuccess,
}: WithdrawDialogProps) => {
  const [withdrawMethod, setWithdrawMethod] = useState<null | {
    type: "visa" | "bank";
    data: any;
  }>(null);
  const [rawAmount, setRawAmount] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [, setError] = useState<string | null>(null);
  const [transactionOpen, setTransactionOpen] = useState<boolean>(false);
  const isExceedsBalance = parseFloat(rawAmount) > Number(balance);
  const { mutation, dialogStatus, steps, txHash } = useWithdrawOrganization({
    onSuccess,
  });
  const isLoading = mutation.isPending;

  const [showDialog, setShowDialog] = useState(false);
  const quickAmounts: number[] = [100, 500, 1000];

  const handleAmountClick = (value: number): void => {
    setAmount(value.toString());
  };

  const handleRemoveMethod = () => {
    localStorage.removeItem("withdrawMethod");
    setWithdrawMethod(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[,$]/g, "");

    if (/^\d*\.?\d{0,6}$/.test(rawVal)) {
      setRawAmount(rawVal);
      setAmount(formatNumberWithComma(rawVal));

      const numericVal = parseFloat(rawVal);

      if (numericVal > parseFloat(balance)) {
        setError("Insufficient balance to withdraw this amount");
      } else if (numericVal < 5) {
        setError("Minimum withdrawal amount is $5");
      } else {
        setError(null);
      }
    }
  };

  const handleWithdraw = (): void => {
    const numericVal = parseFloat(rawAmount);

    if (numericVal < 5) {
      setError("Minimum withdrawal amount is $5");

      return;
    }

    if (numericVal > parseFloat(balance)) {
      setError("Insufficient balance to withdraw this amount");

      return;
    }

    setTransactionOpen(true);
    mutation.mutate(
      {
        amount: numericVal,
        organizationAddress: organizationAddress as HexAddress,
        isOffRamp: true,
      },
      {
        onSuccess: () => {
          setAmount("");
          setRawAmount("");
          setError(null);
        },
      },
    );
  };

  return (
    <>
      <TabsContent value="offramp">
        <Card className="border-0 px-0">
          <CardContent className="px-0">
            <div className="p-6 bg-gradient-to-br from-background via-background/95 to-muted/30 rounded-2xl border">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium flex items-center gap-2">
                  Withdraw Amount
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground px-2 py-1 bg-muted/50 rounded-full">
                    Balance: ${formatCompactNumber(balance || 0)}
                  </span>
                </div>
              </div>
              <div className="relative mb-4">
                <input
                  aria-label="Deposit amount"
                  autoComplete="off"
                  autoCorrect="off"
                  className={`w-full bg-transparent text-3xl font-light text-center px-4 py-3 border-none outline-none ring-0 placeholder:text-gray-500 focus:placeholder:text-gray-400 transition-all ${
                    isExceedsBalance ? "text-red-400" : "text-white"
                  }`}
                  inputMode="decimal"
                  pattern="[0-9]*[.]?[0-9]*"
                  placeholder="$0"
                  spellCheck={false}
                  type="text"
                  value={amount ? `$${amount}` : "$0"}
                  onChange={handleInputChange}
                />
              </div>
              {isExceedsBalance && (
                <div className="flex items-center justify-center gap-2 text-red-400 text-sm mb-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>Amount exceeds available balance</span>
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {quickAmounts.map((amt) => (
                  <Button
                    key={amt}
                    className="px-4 py-2 text-sm font-medium bg-muted/70 hover:bg-muted transition-colors rounded-xl"
                    disabled={
                      typeof rawAmount === "number" ? amt > rawAmount : false
                    }
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAmountClick(amt)}
                  >
                    ${amt.toLocaleString()}
                  </Button>
                ))}
                <Button
                  className="px-4 py-2 text-sm font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-colors rounded-xl"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setRawAmount(balance);
                    setAmount(formatNumberWithComma(balance));
                    setError(null);
                  }}
                >
                  MAX
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-dashed">
                <div className="flex items-center gap-2">
                  <Image
                    alt="USDC Token"
                    className="w-5 h-5"
                    height={20}
                    src="/usdc.png"
                    width={20}
                  />
                  <span className="font-medium text-sm">USDC</span>
                  <span className="text-xs text-muted-foreground">
                    • ERC-20
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Fuel className="w-4 h-4" />
                  <span className="text-sm">~$0.10 gas</span>
                </div>
              </div>
            </div>
            {withdrawMethod ? (
              <div className="cursor-pointer mt-5 border px-4 py-3 rounded-xl hover:bg-muted transition">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {withdrawMethod.type === "visa"
                      ? `Visa - ${withdrawMethod.data.email}`
                      : `Bank ${withdrawMethod.data.bank?.toUpperCase()} - ${withdrawMethod.data.accountName} (${withdrawMethod.data.accountNumber})`}
                  </div>
                  <div className="flex gap-2">
                    <Button size={"icon"} onClick={() => setShowDialog(true)}>
                      <Pencil />
                    </Button>
                    <Button
                      size={"icon"}
                      variant={"destructive"}
                      onClick={handleRemoveMethod}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <WithdrawlDialog setWithdrawMethod={setWithdrawMethod} />
            )}

            {showDialog && (
              <WithdrawlDialog
                initialMethod={withdrawMethod ?? undefined}
                open={showDialog}
                setWithdrawMethod={setWithdrawMethod}
                onOpenChange={setShowDialog}
              />
            )}
          </CardContent>
          <CardFooter className="px-0">
            <Button
              className={cn(
                `w-full`,
                !isExceedsBalance
                  ? "border-2 border-b-muted-foreground"
                  : "text-red-400",
              )}
              disabled={
                parseFloat(rawAmount || "0") < 5 ||
                parseFloat(rawAmount || "0") > parseFloat(balance)
              }
              size="lg"
              variant={isExceedsBalance ? "destructive" : "default"}
              onClick={handleWithdraw}
            >
              {isLoading
                ? "Processing..."
                : !rawAmount
                  ? "Enter Amount"
                  : !isExceedsBalance
                    ? `Withdraw $${parseFloat(rawAmount).toLocaleString()}`
                    : "Insufficient balance"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TransactionDialog
        errorMessage={mutation.error?.message}
        isOpen={transactionOpen}
        status={dialogStatus()}
        steps={steps}
        txHash={txHash as HexAddress}
        onClose={() => setTransactionOpen(false)}
      />
    </>
  );
};
