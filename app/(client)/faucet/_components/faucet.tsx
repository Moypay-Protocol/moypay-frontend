"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useAccount } from "wagmi";

import { Button } from "@/components/ui/button";
import TransactionDialog from "@/components/dialog/dialog-transactions";
import { useMint } from "@/hooks/mutation/contract/use-mint";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { urlExplorer } from "@/lib/helper/web3";
import { contractAddresses } from "@/lib/constants";
import { formatCompactNumber } from "@/lib/helper/number";
import { useBalanceCustom } from "@/hooks/query/contract/use-balance-custom";

export default function Faucet() {
  const { address: userAddress } = useAccount();
  const [amount] = useState(50000);
  const [transactionOpen, setTransactionOpen] = useState(false);
  const { mutation, dialogStatus, steps, txHash } = useMint({
    onSuccess: () => {
      setTransactionOpen(false);
    },
  });

  const mockUSDCAddress = contractAddresses.mockUSDC;

  const { balanceNormalized } = useBalanceCustom({
    tokenAddress: mockUSDCAddress,
    enabled: !!mockUSDCAddress && !!userAddress,
    refetchInterval: 5000,
  });

  const handleClaim = () => {
    setTransactionOpen(true);
    mutation.mutate({
      amount,
      toAddress: userAddress as HexAddress,
      tokenAddress: mockUSDCAddress,
    });
  };

  return (
    <div className="w-full h-auto max-w-7xl mx-auto px-4 py-6 2xl:p-10">
      <div className="flex flex-col gap-6 p-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Faucet
            </h1>
            <p className="text-muted-foreground">
              Claim faucet tokens to test the dapp.
            </p>
          </div>
        </div>

        <Separator />

        <Card className="relative overflow-hidden p-0 w-fit">
          <div
            className="absolute inset-0 rounded-[inherit] transition-transform duration-700 group-hover:scale-110"
            style={{
              background: `url("/usdc.png") center center / cover no-repeat`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent rounded-[inherit]" />
            <div className="absolute inset-0 backdrop-blur-[80px] bg-gradient-to-b from-background/90 via-background/60 to-background/30 dark:from-background/95 dark:via-background/70 dark:to-background/40 rounded-[inherit]" />
          </div>
          <CardContent className="relative px-5 pt-5 min-h-[120px] w-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-foreground/10 w-fit py-1 px-2 rounded-full">
                <span className="text-sm">Balance: </span>
                <Image
                  alt="Token Icon"
                  className="w-6 h-6 rounded-full ml-1 cursor-help"
                  height={200}
                  src={"/usdc.png"}
                  width={200}
                />
                <span className="font-light text-sm cursor-help">
                  {formatCompactNumber(Number(balanceNormalized))}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-5">
              <div className="relative">
                <Image
                  alt="Token"
                  className="w-12 h-12 rounded-full cursor-help"
                  height={48}
                  src={"/usdc.png"}
                  width={48}
                />
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  className="group hover:underline"
                  href={urlExplorer({
                    chainId: 84532,
                    address: mockUSDCAddress,
                  })}
                  target="_blank"
                >
                  <div className="flex gap-1 items-center">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                      USDC
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground hover:text-primary" />
                  </div>
                </Link>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="cursor-help">ERC20</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="relative border-t rounded-lg p-4 flex items-center w-full sm:w-auto gap-2">
            <Button
              className="px-6 py-3"
              variant="default"
              onClick={handleClaim}
            >
              Claim {formatCompactNumber(amount)} USDC
            </Button>
          </div>
        </Card>

        <TransactionDialog
          isOpen={transactionOpen}
          status={dialogStatus()}
          steps={steps}
          txHash={txHash as HexAddress}
          onClose={() => setTransactionOpen(false)}
        />
      </div>
    </div>
  );
}
