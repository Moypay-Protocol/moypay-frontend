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

const STEP_TEMPLATES: Step[] = [
  { step: 1, text: "Preparing Transaction", status: "idle" },
  { step: 2, text: "Approving Token", status: "idle" },
  { step: 3, text: "Depositing Additional Token", status: "idle" },
  { step: 4, text: "Updating Employee Salary", status: "idle" },
  { step: 5, text: "Finalizing", status: "idle" },
];

export const useUpdateEmployeeSalary = () => {
  const { address: userAddress } = useAccount();

  const [steps, setSteps] = useState<Step[]>(STEP_TEMPLATES);
  const [txHash, setTxHash] = useState<HexAddress | null>(null);

  const updateStepStatus = (
    stepNumber: number,
    status: Status,
    error?: string,
  ) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.step === stepNumber ? { ...step, status, error } : step,
      ),
    );
  };

  const mutation = useMutation({
    mutationFn: async ({
      employeeAddress,
      newSalary,
      currentSalary,
      startStream,
      isNow,
      organizationAddress,
    }: {
      employeeAddress: HexAddress;
      newSalary: number;
      currentSalary: number;
      startStream: number;
      isNow: boolean;
      organizationAddress: HexAddress;
    }) => {
      try {
        setSteps(STEP_TEMPLATES.map((s) => ({ ...s, status: "idle" })));

        updateStepStatus(1, "loading");

        if (!userAddress) throw new Error("User not connected");

        const denormalizedNewSalary = denormalize(newSalary, 18);
        const mockUSDC = contractAddresses.mockUSDC;

        updateStepStatus(1, "success");

        if (newSalary > currentSalary) {
          const additionalAmount = denormalize(newSalary - currentSalary, 18);

          updateStepStatus(2, "loading");

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

          updateStepStatus(2, "success");
          updateStepStatus(3, "loading");

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

          updateStepStatus(3, "success");
        } else {
          updateStepStatus(2, "success");
          updateStepStatus(3, "success");
        }

        updateStepStatus(4, "loading");

        const txHash = await writeContract(config, {
          address: organizationAddress,
          abi: OrganizationABI,
          functionName: "setEmployeeSalary",
          args: [
            employeeAddress,
            valueToBigInt(denormalizedNewSalary),
            valueToBigInt(startStream),
            Boolean(isNow),
          ],
        });

        const result = await waitForTransactionReceipt(config, {
          hash: txHash,
        });

        if (!result.status) {
          throw new Error("Update salary transaction failed");
        }

        setTxHash(txHash);

        updateStepStatus(4, "success");
        updateStepStatus(5, "loading");

        await new Promise((r) => setTimeout(r, 1000));

        updateStepStatus(5, "success");

        return result;
      } catch (e) {
        const message = (e as Error).message || "Unknown error";

        setSteps((prev) =>
          prev.map((step) =>
            step.status === "loading"
              ? { ...step, status: "error", error: message }
              : step,
          ),
        );
        throw e;
      }
    },
  });

  const dialogStatus = () => {
    if (mutation.isPending) return "loading";
    if (mutation.isSuccess) return "success";
    if (mutation.isError) return "failed";

    return "idle";
  };

  return {
    steps,
    mutation,
    txHash,
    dialogStatus,
  };
};
