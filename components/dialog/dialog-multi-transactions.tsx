import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  X,
} from "lucide-react";

import { urlExplorer } from "@/lib/helper/web3";

type Status = "idle" | "loading" | "success" | "error";
type HexAddress = `0x${string}`;

interface Step {
  step: number;
  text: string;
  status: Status;
  error?: string;
}

interface Transaction {
  id: string;
  name: string;
  steps: Step[];
  txHash?: HexAddress;
  status: "idle" | "loading" | "success" | "failed";
  errorMessage?: string;
}

interface MultiTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  title?: string;
  description?: string;
}

const MultiTransactionDialog: React.FC<MultiTransactionDialogProps> = ({
  isOpen,
  onClose,
  transactions,
  title = "Processing Transactions",
  description = "Please wait while we process your transactions",
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClose = () => {
    const hasRunningTransaction = transactions.some(
      (tx) => tx.status === "loading",
    );
    const hasStepError = transactions.some((tx) =>
      tx.steps.some((step) => step.status === "error"),
    );

    if (hasRunningTransaction && !hasStepError) return;
    onClose();
  };

  if (!isOpen) return null;

  const allCompleted = transactions.every(
    (tx) => tx.status === "success" || tx.status === "failed",
  );
  const hasError = transactions.some(
    (tx) =>
      tx.status === "failed" ||
      tx.steps.some((step) => step.status === "error"),
  );
  const isProcessing = transactions.some((tx) => tx.status === "loading");
  const allSuccess = transactions.every((tx) => tx.status === "success");

  const canClose = allCompleted || hasError;

  const getOverallStatus = () => {
    if (isProcessing) return "loading";
    if (allSuccess) return "success";
    if (hasError) return "failed";

    return "idle";
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        aria-label="Close dialog"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        role="button"
        tabIndex={0}
        onClick={canClose ? handleClose : undefined}
        onKeyDown={
          canClose
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleClose();
                }
              }
            : undefined
        }
      />

      <div className="relative bg-background rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-800">
        <div className="relative px-6 pt-6 pb-4">
          {canClose && (
            <button
              className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
              onClick={handleClose}
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}

          <div className="text-center">
            {overallStatus === "success" && (
              <div className="w-16 h-16 mx-auto mb-4 bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            )}

            {overallStatus === "failed" && (
              <div className="w-16 h-16 mx-auto mb-4 bg-red-900/30 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            )}

            {overallStatus === "loading" && (
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-900/30 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
            )}

            <h2 className="text-xl font-semibold text-white mb-2">
              {overallStatus === "loading" && title}
              {overallStatus === "success" && "All Transactions Complete"}
              {overallStatus === "failed" && "Transaction Error"}
            </h2>

            <p className="text-gray-400 text-sm">
              {overallStatus === "loading" && description}
              {overallStatus === "success" &&
                "All your transactions have been confirmed"}
              {overallStatus === "failed" && "One or more transactions failed"}
            </p>
          </div>
        </div>

        <div className="px-6 pb-4 max-h-96 overflow-y-auto">
          <div className="space-y-6">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="space-y-3">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-800">
                  <div className="flex-shrink-0">
                    {transaction.status === "success" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : transaction.status === "failed" ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : transaction.status === "loading" ? (
                      <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    ) : (
                      <div className="w-5 h-5 bg-gray-700 rounded-full" />
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-white">
                    {transaction.name}
                  </h3>
                </div>

                {transaction.steps.length > 0 && (
                  <div className="space-y-3 ml-8">
                    {transaction.steps.map((step, stepIndex) => {
                      const isActive = step.status === "loading";
                      const isCompleted = step.status === "success";
                      const hasError = step.status === "error";

                      return (
                        <div
                          key={step.step}
                          className="flex items-center gap-3"
                        >
                          <div className="flex-shrink-0 relative">
                            {isCompleted ? (
                              <div className="w-6 h-6 bg-green-900/30 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              </div>
                            ) : hasError ? (
                              <div className="w-6 h-6 bg-red-900/30 rounded-full flex items-center justify-center">
                                <XCircle className="w-4 h-4 text-red-400" />
                              </div>
                            ) : isActive ? (
                              <div className="w-6 h-6 bg-blue-900/30 rounded-full flex items-center justify-center">
                                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                                <span className="text-gray-500 text-xs font-medium">
                                  {step.step}
                                </span>
                              </div>
                            )}

                            {stepIndex < transaction.steps.length - 1 && (
                              <div
                                className={`absolute top-6 left-3 w-px h-4 ${
                                  isCompleted ? "bg-green-800" : "bg-gray-700"
                                }`}
                              />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-medium ${
                                isCompleted
                                  ? "text-green-300"
                                  : hasError
                                    ? "text-red-300"
                                    : isActive
                                      ? "text-blue-300"
                                      : "text-gray-400"
                              }`}
                            >
                              {step.text}
                            </p>
                            {hasError && step.error && (
                              <p className="text-xs text-red-400 mt-1">
                                {step.error}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {transaction.txHash && transaction.status !== "loading" && (
                  <div className="ml-8 mt-3">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-300">
                          Transaction Hash
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            title="Copy"
                            onClick={() =>
                              copyToClipboard(
                                transaction.txHash!,
                                `${transaction.id}-hash`,
                              )
                            }
                          >
                            {copied === `${transaction.id}-hash` ? (
                              <Check className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-gray-400" />
                            )}
                          </button>
                          <a
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            href={urlExplorer({
                              txHash: transaction.txHash,
                              chainId: 84532,
                            })}
                            rel="noopener noreferrer"
                            target="_blank"
                            title="View on Explorer"
                          >
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </a>
                        </div>
                      </div>
                      <code className="text-xs font-mono text-gray-200 break-all block bg-gray-900 rounded p-2">
                        {transaction.txHash}
                      </code>
                    </div>
                  </div>
                )}

                {transaction.status === "failed" &&
                  transaction.errorMessage && (
                    <div className="ml-8 mt-3">
                      <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-red-300">
                            {transaction.errorMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          {isProcessing && !hasError ? (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                Please don&#39;t close this window
              </div>
            </div>
          ) : (
            <button
              className={`w-full py-3 px-4 rounded-2xl font-medium text-sm transition-colors ${
                allSuccess
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : hasError
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
              onClick={handleClose}
            >
              {allSuccess ? "Done" : hasError ? "Close" : "Close"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiTransactionDialog;
