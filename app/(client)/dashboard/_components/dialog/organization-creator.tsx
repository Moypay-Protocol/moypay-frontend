"use client";

import React, { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { Loader2, Plus, Building, AlertCircle } from "lucide-react";
import { isAddress } from "viem";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { contractAddresses } from "@/lib/constants";
import { useCreateOrganization } from "@/hooks/mutation/contract/use-create-organization";
import TransactionDialog from "@/components/dialog/dialog-transactions";

interface OrganizationCreatorProps {
  onSuccess?: () => void;
}

export default function OrganizationCreator({
  onSuccess,
}: OrganizationCreatorProps) {
  const { address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [transactionOpen, setTransactionOpen] = useState(false);

  const { mutation, dialogStatus, steps, txHash } = useCreateOrganization();

  const isLoading = mutation.isPending;
  const MAX_NAME_LENGTH = 15;
  const MIN_NAME_LENGTH = 2;

  const nameValidation = useMemo(() => {
    if (!organizationName) {
      return { isValid: true, error: "" };
    }

    const trimmedName = organizationName.trim();

    if (trimmedName.length < MIN_NAME_LENGTH) {
      return {
        isValid: false,
        error: `Name must be at least ${MIN_NAME_LENGTH} characters`,
      };
    }

    if (organizationName.length > MAX_NAME_LENGTH) {
      return {
        isValid: false,
        error: `Name must not exceed ${MAX_NAME_LENGTH} characters`,
      };
    }

    if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
      return {
        isValid: false,
        error:
          "Name can only contain letters, numbers, spaces, hyphens, and underscores",
      };
    }

    return { isValid: true, error: "" };
  }, [organizationName]);

  const handleCreateOrganization = async () => {
    if (
      !address ||
      !tokenAddress ||
      !isAddress(tokenAddress) ||
      !organizationName.trim()
    ) {
      return;
    }

    setIsOpen(false);
    setTransactionOpen(true);

    mutation.mutate(
      {
        nameOrganization: organizationName,
        tokenAddress: tokenAddress,
        onSuccess: onSuccess,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setTokenAddress("");
          setOrganizationName("");
        },
      },
    );
  };

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
          <Button className="w-auto justify-start" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Organization
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Create New Organization
            </DialogTitle>
            <DialogDescription>
              Create a new organization to manage employees and payroll.
              You&apos;ll need an ERC20 token address for payments.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="org-name">Organization Name</Label>
                <span
                  className={`text-xs ${
                    organizationName.length > MAX_NAME_LENGTH
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {organizationName.length}/{MAX_NAME_LENGTH}
                </span>
              </div>
              <Input
                className={`h-12 ${!nameValidation.isValid ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                id="org-name"
                maxLength={MAX_NAME_LENGTH}
                placeholder="Enter organization name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
              {!nameValidation.isValid && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{nameValidation.error}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="token-address">Payment Token</Label>
              <Select
                value={tokenAddress}
                onValueChange={(value) => setTokenAddress(value)}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder="Select token for payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={contractAddresses.mockUSDC}>
                    <div className="flex items-center">
                      <Image
                        alt="USDC Token"
                        className="inline-block mr-2"
                        height={20}
                        src="/usdc.png"
                        width={20}
                      />
                      <span>mUSDC</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose an ERC20 token to use for payments
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-between sm:flex-row sm:justify-between w-full items-center">
            <Button
              disabled={isLoading}
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={
                isLoading ||
                !tokenAddress ||
                !organizationName.trim() ||
                !nameValidation.isValid
              }
              onClick={handleCreateOrganization}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
