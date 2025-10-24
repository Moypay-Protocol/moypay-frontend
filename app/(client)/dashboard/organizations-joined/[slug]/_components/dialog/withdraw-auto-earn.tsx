"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AlertCircle, Fuel } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCompactNumber } from "@/lib/helper/number";
import { EarnData } from "@/data/earn.data";
import ConnectButtonWrapper from "@/components/wallet/connect-button-wrapper";
import TransactionDialog from "@/components/dialog/dialog-transactions";
import { useWithdrawEarn } from "@/hooks/mutation/contract/use-withdraw-earn";

interface WithdrawAutoEarnDialogProps {
  protocol: EarnData;
  refetch?: () => void;
  trigger?: React.ReactNode;
  organizationAddress: HexAddress;
  stakedAmount: string;
}

type HexAddress = `0x${string}`;

const WithdrawAutoEarnDialog: React.FC<WithdrawAutoEarnDialogProps> = ({
  trigger,
  refetch,
  protocol,
  organizationAddress,
  stakedAmount,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [selectedToken] = useState<string>("USDC");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [transactionOpen, setTransactionOpen] = useState<boolean>(false);

  const { mutation, dialogStatus, steps, txHash } = useWithdrawEarn({
    onSuccess: () => {
      setIsOpen(false);
      setAmount("");
      refetch?.();
    },
  });

  const quickAmounts: number[] = [100, 500, 1000];

  const handleAmountClick = (value: number): void => {
    setAmount(value.toString());
  };

  const handleMaxClick = (): void => {
    if (stakedAmount) {
      setAmount(stakedAmount.toString());
    }
  };

  const handleWithdraw = (): void => {
    setIsOpen(false);
    setTransactionOpen(true);

    mutation.mutate({
      amount: parseFloat(amount) || 0,
      protocolAddress: protocol.address as HexAddress,
      organizationAddress: organizationAddress,
      isOffRamp: false,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let value = e.target.value;

    value = value.replace(/[^0-9.]/g, "");

    const decimalCount = (value.match(/\./g) || []).length;

    if (decimalCount > 1) {
      return;
    }

    const parts = value.split(".");

    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + "." + parts[1].substring(0, 2);
    }

    if (value.length > 1 && value[0] === "0" && value[1] !== ".") {
      value = value.substring(1);
    }

    setAmount(value);
  };

  const getDisplayValue = (): string => {
    if (amount === "") return "";

    return `$${amount}`;
  };

  const displayValue = getDisplayValue();
  const numericAmount = parseFloat(amount) || 0;
  const isValidAmount = amount !== "" && numericAmount > 0;
  const isExceedsStaked = numericAmount > Number(stakedAmount);
  const isLoading = mutation.isPending;

  return (
    <React.Fragment>
      <TransactionDialog
        errorMessage={mutation.error?.message}
        isOpen={transactionOpen}
        status={dialogStatus()}
        steps={steps}
        txHash={txHash as HexAddress}
        onClose={() => setTransactionOpen(false)}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button
              className="flex-1 flex items-center justify-center gap-1 rounded-2xl"
              variant="outline"
            >
              Withdraw Auto Earn
            </Button>
          )}
        </DialogTrigger>

        <DialogContent
          aria-describedby={undefined}
          className="sm:max-w-md w-[95vw] max-h-[90vh] p-0 overflow-auto rounded-2xl"
        >
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-white">
              Withdraw Auto Earn from {protocol.name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {protocol.description}
            </p>
          </DialogHeader>

          <div className="flex flex-col gap-6 px-6 pb-6">
            <div className="flex items-center gap-3 p-4 bg-background/50 rounded-2xl border border-muted-foreground/20">
              <Image
                alt={protocol.name}
                className="w-10 h-10 rounded-full"
                height={40}
                src={protocol.iconUrl}
                width={40}
              />
              <div className="flex-1">
                <h4 className="font-semibold text-white">{protocol.name}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{protocol.apy}% APY</span>
                  <span>{formatCompactNumber(protocol.tvl)} TVL</span>
                </div>
              </div>
            </div>

            <div>
              <div className="p-6 bg-gradient-to-br from-background via-background/95 to-muted/30 rounded-2xl border">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium flex items-center gap-2">
                    You&apos;re withdrawing
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-muted/50 rounded-full">
                      Staked: {formatCompactNumber(stakedAmount || 0)}{" "}
                      {selectedToken}
                    </span>
                  </div>
                </div>

                <div className="relative mb-4">
                  <input
                    aria-label="Deposit amount"
                    autoComplete="off"
                    autoCorrect="off"
                    className={`w-full bg-transparent text-3xl font-light text-center px-4 py-3 border-none outline-none ring-0 placeholder:text-gray-500 focus:placeholder:text-gray-400 transition-all ${
                      isExceedsStaked ? "text-red-400" : "text-white"
                    }`}
                    inputMode="decimal"
                    pattern="[0-9]*[.]?[0-9]*"
                    placeholder="$0"
                    spellCheck={false}
                    type="text"
                    value={displayValue}
                    onChange={handleInputChange}
                  />
                </div>

                {isExceedsStaked && (
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
                        typeof stakedAmount === "number"
                          ? amt > stakedAmount
                          : false
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
                    onClick={() => handleMaxClick()}
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
                    <span className="font-medium text-sm">{selectedToken}</span>
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
            </div>

            <ConnectButtonWrapper>
              <Button
                className={`${
                  isExceedsStaked
                    ? "bg-red-600/20 border-red-600/30 text-red-400 cursor-not-allowed"
                    : ""
                }`}
                disabled={!isValidAmount || isExceedsStaked || isLoading}
                onClick={handleWithdraw}
              >
                {isLoading
                  ? "Processing..."
                  : !isValidAmount
                    ? "Enter an amount"
                    : isExceedsStaked
                      ? "Exceeds balance"
                      : `Withdraw ${numericAmount.toLocaleString()} ${selectedToken}`}
              </Button>
            </ConnectButtonWrapper>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default WithdrawAutoEarnDialog;
