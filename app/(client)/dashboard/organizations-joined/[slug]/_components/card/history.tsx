import React from "react";
import { ArrowDownLeft, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCompactNumber } from "@/lib/helper/number";
import { normalize } from "@/lib/helper/bignumber";
import { urlExplorer } from "@/lib/helper/web3";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { WithdrawItem } from "@/types/graphql/withdraw.type";

export default function HistoryCard({
  withdrawsData,
  withdrawsLoading,
}: {
  withdrawsData: WithdrawItem[];
  withdrawsLoading: boolean;
}) {
  return (
    <div className="border border-b-muted-foreground hover:border-primary transition-all duration-200 rounded-2xl p-5 space-y-4  bg-gradient-to-br from-background via-background/95 to-muted/30 backdrop-blur-sm h-155 max-h-155">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">
            Withdraw History
          </h2>
          <p className="text-sm text-muted-foreground">
            View your withdrawals history
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-3 h-auto overflow-y-auto">
        {withdrawsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        ) : withdrawsData && withdrawsData.length > 0 ? (
          withdrawsData.slice(0, 5).map((withdraw, index) => (
            <div
              key={index}
              className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <ArrowDownLeft className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Withdrawal</span>
                </div>
                <span className="font-mono font-semibold">
                  ${formatCompactNumber(normalize(withdraw.amount, 18))}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>
                  {new Date(
                    withdraw.blockTimestamp * 1000,
                  ).toLocaleDateString()}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      className="flex items-center gap-1 hover:text-primary"
                      href={urlExplorer({
                        chainId: 84532,
                        txHash: withdraw.transactionHash,
                      })}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View on blockchain explorer</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Transactions Yet</h3>
            <p className="text-sm text-muted-foreground">
              Your transaction history will appear here once you make
              withdrawals
            </p>
          </div>
        )}

        {withdrawsData && withdrawsData.length > 5 && (
          <div className="text-center pt-2">
            <Button size="sm" variant="ghost">
              View All Transactions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
