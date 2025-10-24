import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount } from "wagmi";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";

import { contractAddresses } from "@/lib/constants";
import { config } from "@/lib/wagmi";
import { FactoryABI } from "@/lib/abis/factory.abi";

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
  { step: 2, text: "Creating Organization", status: "idle" },
  { step: 3, text: "Finalizing", status: "idle" },
];

export const useCreateOrganization = () => {
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
      nameOrganization,
      tokenAddress,
      onSuccess,
    }: {
      nameOrganization: string;
      tokenAddress: HexAddress;
      onSuccess?: () => void;
    }) => {
      try {
        setSteps(STEP_TEMPLATES.map((s) => ({ ...s, status: "idle" })));
        updateStepStatus(1, "loading");

        if (!userAddress) throw new Error("User not connected");

        const factoryAddress = contractAddresses.factory;

        updateStepStatus(1, "success");
        updateStepStatus(2, "loading");

        const txHash = await writeContract(config, {
          address: factoryAddress,
          abi: FactoryABI,
          functionName: "createOrganization",
          args: [tokenAddress, nameOrganization],
        });

        const result = await waitForTransactionReceipt(config, {
          hash: txHash,
        });

        if (!result.status) {
          throw new Error("Organization creation failed");
        }

        setTxHash(txHash);

        updateStepStatus(2, "success");
        updateStepStatus(3, "loading");

        await new Promise((r) => setTimeout(r, 1000));

        updateStepStatus(3, "success");

        onSuccess?.();
        window.location.reload();

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
