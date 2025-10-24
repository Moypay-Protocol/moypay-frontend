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
import { useBalanceCustom } from "@/hooks/query/contract/use-balance-custom";
import { contractAddresses } from "@/lib/constants";
import { formatCompactNumber } from "@/lib/helper/number";
import { useDepositOrganization } from "@/hooks/mutation/contract/use-deposit-organization";
import TransactionDialog from "@/components/dialog/dialog-transactions";
import ConnectButtonWrapper from "@/components/wallet/connect-button-wrapper";

interface DepositDialogProps {
  organizationAddress: string;
  refetch: () => void;
  trigger?: React.ReactNode;
}

const DepositDialog: React.FC<DepositDialogProps> = ({
  trigger,
  refetch,
  organizationAddress,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [selectedToken] = useState<string>("USDC");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [transactionOpen, setTransactionOpen] = useState<boolean>(false);

  const { mutation, dialogStatus, steps, txHash } = useDepositOrganization();

  const { balanceNormalized } = useBalanceCustom({
    tokenAddress: contractAddresses.mockUSDC,
  });

  const quickAmounts: number[] = [100, 1000];

  const handleAmountClick = (value: number): void => {
    setAmount(value.toString());
  };

  const handleMaxClick = (): void => {
    if (balanceNormalized) {
      setAmount(balanceNormalized.toString());
    }
  };

  const handleDeposit = (): void => {
    setIsOpen(false);
    setTransactionOpen(true);

    mutation.mutate(
      {
        salary: parseFloat(amount) || 0,
        organizationAddress: organizationAddress as HexAddress,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setAmount("");
          refetch();
        },
      },
    );
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
  const isExceedsBalance = numericAmount > Number(balanceNormalized);

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
            <Button className="px-6 py-3 rounded-xl font-medium">
              Deposit Funds
            </Button>
          )}
        </DialogTrigger>

        <DialogContent
          aria-describedby={undefined}
          className="sm:max-w-md w-[95vw] max-h-[90vh] p-0 overflow-auto rounded-2xl"
        >
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-white">
              Deposit Funds
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6 px-6 pb-6">
            <div>
              <div className="p-6 bg-gradient-to-br from-background via-background/95 to-muted/30 rounded-2xl border">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium flex items-center gap-2">
                    You&#39;re depositing
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-muted/50 rounded-full">
                      Balance: {formatCompactNumber(balanceNormalized || 0)}{" "}
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
                      isExceedsBalance ? "text-red-400" : "text-white"
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
                        typeof balanceNormalized === "number"
                          ? amt > balanceNormalized
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
                  isExceedsBalance
                    ? "bg-red-600/20 border-red-600/30 text-red-400 cursor-not-allowed"
                    : ""
                }`}
                disabled={!isValidAmount || isExceedsBalance}
                onClick={handleDeposit}
              >
                {!isValidAmount
                  ? "Enter an amount"
                  : isExceedsBalance
                    ? "Insufficient balance"
                    : `Deposit ${numericAmount.toLocaleString()} ${selectedToken}`}
              </Button>
            </ConnectButtonWrapper>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default DepositDialog;
