import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount } from "wagmi";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";
import { erc20Abi } from "viem";
import { baseSepolia } from "wagmi/chains";

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
  { step: 2, text: "Aproving Token", status: "idle" },
  { step: 3, text: "Depositing Token", status: "idle" },
  { step: 4, text: "Finalizing", status: "idle" },
];

export const useDepositOrganization = () => {
  const { address: userAddress, chain } = useAccount();

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
      salary,
      organizationAddress,
    }: {
      salary: number;
      organizationAddress: HexAddress;
    }) => {
      try {
        setSteps(STEP_TEMPLATES.map((s) => ({ ...s, status: "idle" })));

        updateStepStatus(1, "loading");

        if (!userAddress) throw new Error("User not connected");
        if (!chain || chain.id !== baseSepolia.id) {
          throw new Error("Please switch to Base Sepolia network");
        }

        const denormalizedSalary = denormalize(salary, 18);
        const mockUSDC = contractAddresses.mockUSDC;

        updateStepStatus(1, "success");
        updateStepStatus(2, "loading");

        const allowance = await readContract(config, {
          address: mockUSDC,
          abi: erc20Abi,
          functionName: "allowance",
          args: [userAddress, organizationAddress],
        });

        if (Number(allowance) < Number(denormalizedSalary)) {
          const approveTxHash = await writeContract(config, {
            address: mockUSDC,
            abi: erc20Abi,
            functionName: "approve",
            args: [organizationAddress, valueToBigInt(denormalizedSalary)],
            chainId: baseSepolia.id,
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

        const txHash = await writeContract(config, {
          address: organizationAddress,
          abi: OrganizationABI,
          functionName: "deposit",
          args: [valueToBigInt(denormalizedSalary)],
          chainId: baseSepolia.id,
        });

        const result = await waitForTransactionReceipt(config, {
          hash: txHash,
        });

        if (!result.status) {
          throw new Error("Set salary transaction failed");
        }

        setTxHash(txHash);

        updateStepStatus(3, "success");
        updateStepStatus(4, "loading");

        await new Promise((r) => setTimeout(r, 1000));

        updateStepStatus(4, "success");

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
