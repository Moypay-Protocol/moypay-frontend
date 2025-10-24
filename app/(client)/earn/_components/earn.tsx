"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { earnData } from "@/data/earn.data";
import { formatCompactNumber } from "@/lib/helper/number";
import StakeDialog from "@/app/(client)/earn/_components/dialog/stake";
import WithdrawDialog from "@/app/(client)/earn/_components/dialog/withdraw";
import { urlExplorer } from "@/lib/helper/web3";
import { Button } from "@/components/ui/button";

export default function Earn() {
  return (
    <TooltipProvider>
      <div className="w-full h-auto max-w-7xl mx-auto px-4 py-6 2xl:p-10">
        <div className="flex flex-col gap-6 p-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Earn
              </h1>
              <p className="text-muted-foreground">
                Explore earning opportunities and stake your assets.
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnData.map((item) => (
              <Card key={item.id} className="relative overflow-hidden p-0">
                <div
                  className="absolute inset-0 rounded-[inherit] transition-transform duration-700 group-hover:scale-110"
                  style={{
                    background: `url("${item.iconUrl}") center center / cover no-repeat`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent rounded-[inherit]" />
                  <div className="absolute inset-0 backdrop-blur-[80px] bg-gradient-to-b from-background/90 via-background/60 to-background/30 dark:from-background/95 dark:via-background/70 dark:to-background/40 rounded-[inherit]" />
                </div>
                <CardContent className="relative px-5 pt-5 min-h-[120px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-foreground/10 w-fit py-1 pl-1 pr-2 rounded-full">
                      <div className="flex items-center gap-2 border border-foreground/10 w-fit py-1 pl-1 pr-2 rounded-full">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Image
                              alt="Protocol Icon"
                              className="w-6 h-6 rounded-full cursor-help"
                              height={200}
                              src={item.iconUrl}
                              width={200}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.name} Protocol</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-light text-sm cursor-help">
                              {item.apy}% APY
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Annual Percentage Yield</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Image
                            alt="Token Icon"
                            className="w-6 h-6 rounded-full ml-1 cursor-help"
                            height={200}
                            src={item.assetUrl}
                            width={200}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Staking Token</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-light text-sm cursor-help">
                            {formatCompactNumber(item.tvl)} TVL
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Total Value Locked: ${formatCompactNumber(item.tvl)}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-5">
                    <div className="relative">
                      <Image
                        alt="Token"
                        className="w-12 h-12 rounded-full cursor-help"
                        height={48}
                        src={item.iconUrl}
                        width={48}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            className="group hover:underline"
                            href={urlExplorer({
                              chainId: 1114,
                              address: item.address,
                            })}
                            target="_blank"
                          >
                            <div className="flex gap-1 items-center">
                              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                                {item.name}
                              </h3>
                              <ArrowUpRight className="w-5 h-5 text-muted-foreground hover:text-primary" />
                            </div>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View on block explorer</p>
                        </TooltipContent>
                      </Tooltip>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="cursor-help">Staking</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="relative border-t rounded-lg p-4 flex items-center w-full sm:w-auto gap-2">
                  <StakeDialog
                    protocol={item}
                    trigger={
                      <Button
                        className="flex-1 flex items-center justify-center gap-1 rounded-2xl"
                        variant="default"
                      >
                        Stake
                      </Button>
                    }
                  />
                  <WithdrawDialog
                    protocol={item}
                    trigger={
                      <Button
                        className="flex-1 flex items-center justify-center gap-1 rounded-2xl"
                        variant="outline"
                      >
                        Withdraw
                      </Button>
                    }
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
