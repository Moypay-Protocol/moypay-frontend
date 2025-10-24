import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount } from "wagmi";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";
import { erc20Abi } from "viem";

import { config } from "@/lib/wagmi";
import { OrganizationABI } from "@/lib/abis/organization.abi";
import { denormalize, valueToBigInt } from "@/lib/helper/bignumber";
import { contractAddresses } from "@/lib/constants";

type Status = "idle" | "loading" | "success" | "error";
type HexAddress = `0x${string}`;

type Step = {
  step: number;
  text: string;
  status: Status;
  error?: string;
};

type Transaction = {
  id: string;
  name: string;
  steps: Step[];
  txHash?: HexAddress;
  status: "idle" | "loading" | "success" | "failed";
  errorMessage?: string;
};

interface ModifyEmployeeParams {
  employeeAddress: HexAddress;
  newName?: string;
  currentName?: string;
  newSalary?: number;
  currentSalary?: number;
  newStatus?: boolean;
  currentStatus?: boolean;
  startStream?: number;
  isNow?: boolean;
  organizationAddress: HexAddress;
}

export const useModifyEmployeeMulti = () => {
  const { address: userAddress } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const updateTransactionStatus = (
    transactionId: string,
    status: "idle" | "loading" | "success" | "failed",
    txHash?: HexAddress,
    errorMessage?: string,
  ) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === transactionId
          ? {
              ...tx,
              status,
              ...(txHash && { txHash }),
              ...(errorMessage && { errorMessage }),
            }
          : tx,
      ),
    );
  };

  const updateStepStatus = (
    transactionId: string,
    stepNumber: number,
    status: Status,
    error?: string,
  ) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === transactionId
          ? {
              ...tx,
              steps: tx.steps.map((step) =>
                step.step === stepNumber ? { ...step, status, error } : step,
              ),
            }
          : tx,
      ),
    );
  };

  const mutation = useMutation({
    mutationFn: async ({
      employeeAddress,
      newName,
      currentName,
      newSalary,
      currentSalary,
      newStatus,
      currentStatus,
      startStream,
      isNow,
      organizationAddress,
    }: ModifyEmployeeParams) => {
      try {
        if (!userAddress) throw new Error("User not connected");

        const needsNameUpdate =
          newName !== undefined &&
          currentName !== undefined &&
          newName !== currentName;
        const needsSalaryUpdate =
          newSalary !== undefined &&
          currentSalary !== undefined &&
          newSalary !== currentSalary;
        const needsStatusUpdate =
          newStatus !== undefined &&
          currentStatus !== undefined &&
          newStatus !== currentStatus;

        const initialTransactions: Transaction[] = [];

        if (needsNameUpdate) {
          const nameSteps: Step[] = [
            { step: 1, text: "Preparing Transaction", status: "idle" },
            { step: 2, text: "Updating Employee Name", status: "idle" },
            { step: 3, text: "Finalizing", status: "idle" },
          ];

          initialTransactions.push({
            id: "name-update",
            name: "Update Employee Name",
            steps: nameSteps,
            status: "idle",
          });
        }

        if (needsSalaryUpdate) {
          const salarySteps: Step[] = [
            { step: 1, text: "Preparing Transaction", status: "idle" },
            { step: 2, text: "Approving Token", status: "idle" },
            { step: 3, text: "Depositing Additional Token", status: "idle" },
            { step: 4, text: "Updating Employee Salary", status: "idle" },
            { step: 5, text: "Finalizing", status: "idle" },
          ];

          initialTransactions.push({
            id: "salary-update",
            name: "Update Employee Salary",
            steps: salarySteps,
            status: "idle",
          });
        }

        if (needsStatusUpdate) {
          const statusSteps: Step[] = [
            { step: 1, text: "Preparing Transaction", status: "idle" },
            { step: 2, text: "Updating Employee Status", status: "idle" },
            { step: 3, text: "Finalizing", status: "idle" },
          ];

          initialTransactions.push({
            id: "status-update",
            name: "Update Employee Status",
            steps: statusSteps,
            status: "idle",
          });
        }

        setTransactions(initialTransactions);

        if (needsNameUpdate && newName !== undefined) {
          updateTransactionStatus("name-update", "loading");

          try {
            updateStepStatus("name-update", 1, "loading");
            updateStepStatus("name-update", 1, "success");
            updateStepStatus("name-update", 2, "loading");

            const txHash = await writeContract(config, {
              address: organizationAddress,
              abi: OrganizationABI,
              functionName: "setEmployeeName",
              args: [employeeAddress, newName],
            });

            const result = await waitForTransactionReceipt(config, {
              hash: txHash,
            });

            if (!result.status) {
              throw new Error("Update name transaction failed");
            }

            updateStepStatus("name-update", 2, "success");
            updateStepStatus("name-update", 3, "loading");

            await new Promise((r) => setTimeout(r, 1000));

            updateStepStatus("name-update", 3, "success");
            updateTransactionStatus("name-update", "success", txHash);
          } catch (error) {
            const message = (error as Error).message || "Unknown error";

            updateTransactionStatus(
              "name-update",
              "failed",
              undefined,
              message,
            );

            setTransactions((prev) =>
              prev.map((tx) =>
                tx.id === "name-update"
                  ? {
                      ...tx,
                      steps: tx.steps.map((step) =>
                        step.status === "loading"
                          ? { ...step, status: "error", error: message }
                          : step,
                      ),
                    }
                  : tx,
              ),
            );
            throw error;
          }
        }

        if (
          needsSalaryUpdate &&
          newSalary !== undefined &&
          currentSalary !== undefined
        ) {
          updateTransactionStatus("salary-update", "loading");

          try {
            updateStepStatus("salary-update", 1, "loading");

            const denormalizedNewSalary = denormalize(newSalary, 18);
            const mockUSDC = contractAddresses.mockUSDC;

            updateStepStatus("salary-update", 1, "success");

            if (newSalary > currentSalary) {
              const additionalAmount = denormalize(
                newSalary - currentSalary,
                18,
              );

              updateStepStatus("salary-update", 2, "loading");

              const allowance = await readContract(config, {
                address: mockUSDC,
                abi: erc20Abi,
                functionName: "allowance",
                args: [userAddress, organizationAddress],
              });

              if (Number(allowance) < Number(additionalAmount)) {
                const approveTxHash = await writeContract(config, {
                  address: mockUSDC,
                  abi: erc20Abi,
                  functionName: "approve",
                  args: [organizationAddress, valueToBigInt(additionalAmount)],
                });

                const receipt = await waitForTransactionReceipt(config, {
                  hash: approveTxHash,
                });

                if (!receipt.status) {
                  throw new Error("Approval transaction failed");
                }
              }

              updateStepStatus("salary-update", 2, "success");
              updateStepStatus("salary-update", 3, "loading");

              const txHashDeposit = await writeContract(config, {
                address: organizationAddress,
                abi: OrganizationABI,
                functionName: "deposit",
                args: [valueToBigInt(additionalAmount)],
              });

              const resultDeposit = await waitForTransactionReceipt(config, {
                hash: txHashDeposit,
              });

              if (!resultDeposit.status) {
                throw new Error("Deposit transaction failed");
              }

              updateStepStatus("salary-update", 3, "success");
            } else {
              updateStepStatus("salary-update", 2, "success");
              updateStepStatus("salary-update", 3, "success");
            }

            updateStepStatus("salary-update", 4, "loading");

            const txHash = await writeContract(config, {
              address: organizationAddress,
              abi: OrganizationABI,
              functionName: "setEmployeeSalary",
              args: [
                employeeAddress,
                valueToBigInt(denormalizedNewSalary),
                valueToBigInt(startStream || Math.floor(Date.now() / 1000)),
                Boolean(isNow ?? true),
              ],
            });

            const result = await waitForTransactionReceipt(config, {
              hash: txHash,
            });

            if (!result.status) {
              throw new Error("Update salary transaction failed");
            }

            updateStepStatus("salary-update", 4, "success");
            updateStepStatus("salary-update", 5, "loading");

            await new Promise((r) => setTimeout(r, 1000));

            updateStepStatus("salary-update", 5, "success");
            updateTransactionStatus("salary-update", "success", txHash);
          } catch (error) {
            const message = (error as Error).message || "Unknown error";

            updateTransactionStatus(
              "salary-update",
              "failed",
              undefined,
              message,
            );

            setTransactions((prev) =>
              prev.map((tx) =>
                tx.id === "salary-update"
                  ? {
                      ...tx,
                      steps: tx.steps.map((step) =>
                        step.status === "loading"
                          ? { ...step, status: "error", error: message }
                          : step,
                      ),
                    }
                  : tx,
              ),
            );
            throw error;
          }
        }

        if (needsStatusUpdate && newStatus !== undefined) {
          updateTransactionStatus("status-update", "loading");

          try {
            updateStepStatus("status-update", 1, "loading");
            updateStepStatus("status-update", 1, "success");
            updateStepStatus("status-update", 2, "loading");

            const txHash = await writeContract(config, {
              address: organizationAddress,
              abi: OrganizationABI,
              functionName: "setEmployeeStatus",
              args: [employeeAddress, newStatus],
            });

            const result = await waitForTransactionReceipt(config, {
              hash: txHash,
            });

            if (!result.status) {
              throw new Error("Update status transaction failed");
            }

            updateStepStatus("status-update", 2, "success");
            updateStepStatus("status-update", 3, "loading");

            await new Promise((r) => setTimeout(r, 1000));

            updateStepStatus("status-update", 3, "success");
            updateTransactionStatus("status-update", "success", txHash);
          } catch (error) {
            const message = (error as Error).message || "Unknown error";

            updateTransactionStatus(
              "status-update",
              "failed",
              undefined,
              message,
            );

            setTransactions((prev) =>
              prev.map((tx) =>
                tx.id === "status-update"
                  ? {
                      ...tx,
                      steps: tx.steps.map((step) =>
                        step.status === "loading"
                          ? { ...step, status: "error", error: message }
                          : step,
                      ),
                    }
                  : tx,
              ),
            );
            throw error;
          }
        }

        return { success: true };
      } catch (e) {
        throw e;
      }
    },
  });

  const dialogStatus = () => {
    const hasLoading = transactions.some((tx) => tx.status === "loading");
    const hasError = transactions.some((tx) => tx.status === "failed");
    const allSuccess =
      transactions.length > 0 &&
      transactions.every((tx) => tx.status === "success");

    if (hasLoading) return "loading";
    if (allSuccess) return "success";
    if (hasError) return "failed";

    return "idle";
  };

  return {
    transactions,
    mutation,
    dialogStatus,
  };
};
