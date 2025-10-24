"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  AlertCircle,
  CheckCircle2,
  Info,
  Fuel,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import TransactionDialog from "@/components/dialog/dialog-transactions";
import { useEnableAutoEarn } from "@/hooks/mutation/contract/use-enable-auto-earn";
import { useDisableAutoEarn } from "@/hooks/mutation/contract/use-disable-auto-earn";
import { formatCompactNumber } from "@/lib/helper/number";
import { earnData, type EarnData } from "@/data/earn.data";

interface EnableAutoEarnDialogProps {
  currentSalary: string;
  organizationAddress: string;
  isAutoEarnEnabled?: boolean;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

type HexAddress = `0x${string}`;

const EnableAutoEarnDialog: React.FC<EnableAutoEarnDialogProps> = ({
  currentSalary,
  organizationAddress,
  isAutoEarnEnabled = false,
  onSuccess,
  trigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [enableAutoEarn, setEnableAutoEarn] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [selectedToken] = useState<string>("USDC");
  const [selectedProtocol, setSelectedProtocol] = useState<EarnData>(
    earnData[0],
  );
  const [currentStep, setCurrentStep] = useState(1);

  const getHighestAPYProtocol = () => {
    return earnData.reduce((prev, current) =>
      prev.apy > current.apy ? prev : current,
    );
  };

  useEffect(() => {
    if (isOpen) {
      setEnableAutoEarn(!isAutoEarnEnabled);
      setSelectedProtocol(getHighestAPYProtocol());
      setCurrentStep(1);
    }
  }, [isOpen, isAutoEarnEnabled]);

  const totalSteps = enableAutoEarn && !isAutoEarnEnabled ? 2 : 1;

  const {
    steps: enableSteps,
    mutation: enableMutation,
    txHash: enableTxHash,
    dialogStatus: enableDialogStatus,
  } = useEnableAutoEarn();

  const {
    steps: disableSteps,
    mutation: disableMutation,
    txHash: disableTxHash,
    dialogStatus: disableDialogStatus,
  } = useDisableAutoEarn();

  const isLoading = enableMutation.isPending || disableMutation.isPending;
  const hasChanges = enableAutoEarn !== isAutoEarnEnabled;
  const numericAmount = parseFloat(amount) || 0;
  const isValidAmount = amount !== "" && numericAmount > 0;
  const isExceedsBalance = numericAmount > Number(currentSalary);

  const handleConfirm = async () => {
    if (!hasChanges) return;

    setIsOpen(false);
    setTransactionOpen(true);

    try {
      if (enableAutoEarn && !isAutoEarnEnabled) {
        await enableMutation.mutateAsync({
          organizationAddress: organizationAddress as HexAddress,
          amount: amount,
          protocolAddress: selectedProtocol.address as HexAddress,
          onSuccess: () => {
            onSuccess?.();
          },
        });
      } else if (!enableAutoEarn && isAutoEarnEnabled) {
        await disableMutation.mutateAsync({
          organizationAddress: organizationAddress as HexAddress,
          protocolAddress: selectedProtocol.address as HexAddress,
          onSuccess: () => {
            onSuccess?.();
          },
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setEnableAutoEarn(isAutoEarnEnabled);
    setAmount("");
    setCurrentStep(1);
  };

  const handleAmountClick = (value: number): void => {
    setAmount(value.toString());
  };

  const handleMaxClick = (): void => {
    if (currentSalary) {
      setAmount(currentSalary.toString());
    }
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
  const quickAmounts: number[] = [100, 1000];

  const getCurrentSteps = () => {
    if (enableMutation.isPending) return enableSteps;
    if (disableMutation.isPending) return disableSteps;

    return [];
  };

  const getCurrentTxHash = () => {
    if (enableTxHash) return enableTxHash;
    if (disableTxHash) return disableTxHash;

    return undefined;
  };

  const getCurrentDialogStatus = () => {
    if (enableMutation.isPending) return enableDialogStatus();
    if (disableMutation.isPending) return disableDialogStatus();
    if (enableMutation.isSuccess || disableMutation.isSuccess) return "success";
    if (enableMutation.isError || disableMutation.isError) return "failed";

    return "idle";
  };

  const getErrorMessage = () => {
    if (enableMutation.error) return enableMutation.error.message;
    if (disableMutation.error) return disableMutation.error.message;

    return undefined;
  };

  const getStepTitle = () => {
    if (!enableAutoEarn || isAutoEarnEnabled) return "Auto Earn Settings";

    switch (currentStep) {
      case 1:
        return "Enable Auto Earn";
      case 2:
        return "Set Investment Amount";
      default:
        return "Auto Earn Settings";
    }
  };

  const canProceedToNextStep = () => {
    if (currentStep === 1) return enableAutoEarn;
    if (currentStep === 2) return isValidAmount && !isExceedsBalance;

    return true;
  };

  const renderStepContent = () => {
    if (!enableAutoEarn) {
      return (
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              What is Auto Earn?
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Auto Earn automatically invests your salary into yield-optimizing
              protocols, helping you grow your earnings passively. Once enabled,
              it will:
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 ml-4">
              <li>• Automatically invest your salary upon receipt</li>
              <li>• Reinvest returns to compound your earnings</li>
              <li>
                • For example, if you initial invest $100, your salary will be
                automatically reinvested once it reaches that amount
              </li>
            </ul>
          </div>
        </div>
      );
    }

    if (isAutoEarnEnabled) {
      return (
        <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-orange-900 dark:text-orange-100">
              Disabling Auto Earn
            </h4>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Auto Earn will be deactivated. You&apos;ll need to manually manage
              your salary withdrawals going forward.
            </p>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="p-4 border-2 border-primary/50 rounded-xl bg-primary/5 relative">
              <div className="absolute top-2 right-2">
                <div className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                  Best APY
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <Image
                    alt={selectedProtocol.name}
                    className="w-10 h-10 rounded-full"
                    height={40}
                    src={selectedProtocol.iconUrl}
                    width={40}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base">
                    {selectedProtocol.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Highest yield • Verified protocol
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {selectedProtocol.apy}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Annual Percentage Yield
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium">
                    ${formatCompactNumber(selectedProtocol.tvl)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Value Locked
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-900 dark:text-green-100">
                    Why This Protocol?
                  </h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 mt-2 space-y-1">
                    <li>• Highest APY available ({selectedProtocol.apy}%)</li>
                    <li>
                      • Battle-tested with $
                      {formatCompactNumber(selectedProtocol.tvl)} TVL
                    </li>
                    <li>• Automatic compound interest</li>
                    <li>• Low gas fees and optimized transactions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-background via-background/95 to-muted/30 rounded-2xl border">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium flex items-center gap-2">
                  Investment Amount
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground px-2 py-1 bg-muted/50 rounded-full">
                    Balance: ${formatCompactNumber(currentSalary || 0)}
                  </span>
                </div>
              </div>

              <div className="relative mb-6">
                <input
                  aria-label="Investment amount"
                  autoComplete="off"
                  autoCorrect="off"
                  className={`w-full bg-transparent text-4xl font-light text-center px-4 py-6 border-none outline-none ring-0 placeholder:text-gray-500 focus:placeholder:text-gray-400 transition-all ${
                    isExceedsBalance ? "text-red-400" : "text-primary"
                  }`}
                  inputMode="decimal"
                  pattern="[0-9]*[.]?[0-9]*"
                  placeholder="$0.00"
                  spellCheck={false}
                  type="text"
                  value={displayValue}
                  onChange={handleInputChange}
                />
                {amount && !isExceedsBalance && (
                  <div className="text-center text-sm text-green-600 mt-2">
                    Estimated annual return: $
                    {(
                      (parseFloat(amount) * selectedProtocol.apy) /
                      100
                    ).toFixed(2)}
                  </div>
                )}
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
                      typeof currentSalary === "number"
                        ? amt > currentSalary
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
        );

      default:
        return null;
    }
  };

  return (
    <>
      <TransactionDialog
        errorMessage={getErrorMessage()}
        isOpen={transactionOpen}
        status={getCurrentDialogStatus()}
        steps={getCurrentSteps()}
        txHash={getCurrentTxHash() as HexAddress}
        onClose={() => setTransactionOpen(false)}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button className="flex items-center justify-center gap-2">
              <Bot className="w-5 h-5" />
              Auto Earn
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                {getStepTitle()}
              </DialogTitle>
            </div>
            {totalSteps > 1 && (
              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </div>
            )}
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isAutoEarnEnabled ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span className="text-sm font-medium">
                  Auto Earn is currently{" "}
                  <span
                    className={
                      isAutoEarnEnabled ? "text-green-600" : "text-gray-500"
                    }
                  >
                    {isAutoEarnEnabled ? "Enabled" : "Disabled"}
                  </span>
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label
                  className="text-base font-medium"
                  htmlFor="auto-earn-toggle"
                >
                  Enable Auto Earn
                </Label>
                <Switch
                  checked={enableAutoEarn}
                  id="auto-earn-toggle"
                  onCheckedChange={(checked) => {
                    setEnableAutoEarn(checked);
                    setCurrentStep(1);
                  }}
                />
              </div>

              {renderStepContent()}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-4">
            <div className="flex items-center gap-2">
              {currentStep > 1 && enableAutoEarn && !isAutoEarnEnabled && (
                <Button
                  className="flex items-center gap-1"
                  variant="ghost"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                disabled={isLoading}
                variant="outline"
                onClick={handleDialogClose}
              >
                Cancel
              </Button>

              {currentStep < totalSteps &&
              enableAutoEarn &&
              !isAutoEarnEnabled ? (
                <Button
                  className="flex items-center gap-1"
                  disabled={!canProceedToNextStep()}
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  className={
                    !enableAutoEarn && isAutoEarnEnabled
                      ? "bg-orange-600 hover:bg-orange-700"
                      : ""
                  }
                  disabled={
                    !hasChanges ||
                    isLoading ||
                    (enableAutoEarn &&
                      !isAutoEarnEnabled &&
                      (!isValidAmount || isExceedsBalance))
                  }
                  onClick={handleConfirm}
                >
                  {!hasChanges
                    ? "No Changes"
                    : enableAutoEarn && !isAutoEarnEnabled
                      ? !isValidAmount
                        ? "Enter Amount"
                        : isExceedsBalance
                          ? "Insufficient Balance"
                          : "Enable Auto Earn"
                      : !enableAutoEarn && isAutoEarnEnabled
                        ? "Disable Auto Earn"
                        : "Confirm"}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnableAutoEarnDialog;
