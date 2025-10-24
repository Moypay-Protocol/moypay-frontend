import React from "react";
import { ArrowUp, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import WithdrawAutoEarnDialog from "../dialog/withdraw-auto-earn";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { formatCompactNumber } from "@/lib/helper/number";
import { normalize } from "@/lib/helper/bignumber";
import { urlExplorer } from "@/lib/helper/web3";
import { EmployeeItem } from "@/types/graphql/employee.type";
import { EarnData } from "@/data/earn.data";
import { EnableAutoEarnItem } from "@/types/graphql/enable-auto-earn.type";
import { Button } from "@/components/ui/button";
import { useBalanceStaked } from "@/hooks/query/contract/use-balance-staked";

export default function AutoEarnCard({
  employee,
  earnData,
  autoEarnData,
  refetch,
}: {
  employee: EmployeeItem;
  earnData: EarnData[];
  autoEarnData: EnableAutoEarnItem;
  refetch: () => void;
}) {
  const protocol = earnData.find((p) => p.address === autoEarnData?.protocol);

  const { stakedAmount } = useBalanceStaked({
    protocolAddress: protocol?.address as HexAddress,
  });

  return (
    <div className="relative border border-b-muted-foreground hover:border-primary transition-all duration-300 rounded-2xl p-6 space-y-4 bg-gradient-to-br from-background via-background/95 to-muted/30 h-155 max-h-155">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">
              Auto Earn Position
            </h2>
            <p className="text-sm text-muted-foreground">
              Automated yield optimization
            </p>
          </div>
        </div>
        {employee?.autoEarnStatus && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-600">Live</span>
          </div>
        )}
      </div>

      <Separator className="opacity-50" />

      {employee?.autoEarnStatus ? (
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Total Staked
                </div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  ${formatCompactNumber(Number(stakedAmount || "0"))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">
                  Earning
                </div>
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {protocol?.apy}% APY
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-2 border-dashed border-muted hover:border-primary/50 rounded-xl bg-muted/20 hover:bg-muted/40 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <Image
                  alt={protocol?.name || "Protocol Icon"}
                  className="w-8 h-8 rounded-full"
                  height={32}
                  src={protocol?.iconUrl || "/placeholder.png"}
                  width={32}
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">
                  {protocol?.name}
                </div>
                <div className="text-xs text-muted-foreground">Verified</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-bold">{protocol?.apy}%</div>
                <div className="text-xs text-muted-foreground">APY</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  ${formatCompactNumber(protocol?.tvl ?? 0)}
                </div>
                <div className="text-xs text-muted-foreground">TVL</div>
              </div>
            </div>
          </div>

          {autoEarnData && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Activity
              </h4>
              <div className="p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-dashed">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium">Auto Investment</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(
                        autoEarnData.blockTimestamp * 1000,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      ${formatCompactNumber(normalize(autoEarnData.amount, 18))}
                    </div>
                    <div className="text-xs text-green-600">
                      +{protocol?.apy || 0}% APY
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-muted">
                  <span className="text-xs text-muted-foreground">
                    Transaction Hash
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                        href={urlExplorer({
                          chainId: 1114,
                          txHash: autoEarnData.transactionHash,
                        })}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span className="font-mono">
                          {autoEarnData.transactionHash.slice(0, 6)}
                          ...{autoEarnData.transactionHash.slice(-4)}
                        </span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View transaction on blockchain explorer</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full mt-5">
                {/* <AutoEarnSettingsDialog
                  currentThreshold="1000" 
                  currentProtocol={protocol!}
                  currentSalary={employee?.salary || "0"}
                  organizationAddress={"0x1234567890abcdef"}
                  onSuccess={() => {
                    console.log("Settings updated successfully");
                  }}
                  trigger={
                    <Button className="flex-1">
                      <Settings />
                      Settings
                    </Button>
                  }
                /> */}
                <WithdrawAutoEarnDialog
                  organizationAddress={employee.organization as HexAddress}
                  protocol={protocol!}
                  refetch={() => {
                    refetch();
                  }}
                  stakedAmount={stakedAmount || "0"}
                  trigger={
                    <Button className="flex-1" variant="default">
                      <ArrowUp />
                      Withdraw Earn
                    </Button>
                  }
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-3">
            Auto Earn Awaiting Activation
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start earning passive income on your salary automatically. Your
            funds will be optimized across the best yield protocols.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
            {earnData.slice(0, 2).map((protocol) => (
              <div
                key={protocol.id}
                className="p-4 border border-dashed rounded-xl bg-muted/30"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Image
                    alt={protocol.name}
                    className="w-8 h-8 rounded-full"
                    height={32}
                    src={protocol.iconUrl}
                    width={32}
                  />
                  <div className="text-left">
                    <div className="font-medium text-sm">{protocol.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Protocol
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{protocol.apy}%</div>
                  <div className="text-xs text-muted-foreground">
                    APY Available
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
