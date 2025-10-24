import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount } from "wagmi";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { Address } from "viem";

import { config } from "@/lib/wagmi";
import { OrganizationABI } from "@/lib/abis/organization.abi";
import { denormalize, valueToBigInt } from "@/lib/helper/bignumber";

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
  { step: 2, text: "Withdrawing Token", status: "idle" },
  { step: 3, text: "Finalizing", status: "idle" },
];

export const useWithdrawOrganization = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
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
      amount,
      organizationAddress,
      isOffRamp = false,
    }: {
      amount: number;
      organizationAddress: HexAddress;
      isOffRamp: boolean;
    }) => {
      try {
        setSteps(STEP_TEMPLATES.map((s) => ({ ...s, status: "idle" })));

        updateStepStatus(1, "loading");

        if (!userAddress) throw new Error("User not connected");

        const denormalizedAmount = denormalize(amount, 18);

        updateStepStatus(1, "success");
        updateStepStatus(2, "loading");

        const txHash = await writeContract(config, {
          address: organizationAddress as Address,
          abi: OrganizationABI,
          functionName: "withdraw",
          args: [valueToBigInt(denormalizedAmount), isOffRamp],
        });

        const result = await waitForTransactionReceipt(config, {
          hash: txHash,
        });

        if (!result.status) {
          throw new Error("Set amount transaction failed");
        }

        setTxHash(txHash);

        updateStepStatus(2, "success");
        updateStepStatus(3, "loading");

        await new Promise((r) => setTimeout(r, 1000));

        updateStepStatus(3, "success");

        onSuccess?.();

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
