"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  AlertCircle,
  Building2,
  ArrowLeft,
  Info,
  Bot,
} from "lucide-react";
import Link from "next/link";

import WithdrawDialog from "./withdraw/dialog/withdraw-dialog";
import EnableAutoEarnDialog from "./dialog/enable-auto-earn-stepper";
import AutoEarnCard from "./card/auto-earn";
import HistoryCard from "./card/history";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { normalize } from "@/lib/helper/bignumber";
import { formatCompactNumber } from "@/lib/helper/number";
import { formatAddress, urlExplorer } from "@/lib/helper/web3";
import { useOrganizationJoinedListById } from "@/hooks/query/graphql/use-organization-joined-list-by-id";
import { getPeriodLabel } from "@/lib/helper/period";
import { useEmployeeListsByEmployee } from "@/hooks/query/graphql/use-employee-lists-by-employee";
import { useEmployeeSalary } from "@/hooks/query/graphql/use-employee-salary";
import { useEnableAutoEarnsByEmployee } from "@/hooks/query/graphql/use-enable-auto-earn-by-employee";
import { useWithdrawsByEmployee } from "@/hooks/query/graphql/use-withdraws-by-employee";
import { earnData } from "@/data/earn.data";

interface OrganizationProps {
  id: string;
}

export default function OrganizationJoined({ id }: OrganizationProps) {
  const {
    data: org,
    isLoading: orgLoading,
    error: orgError,
    refetch,
  } = useOrganizationJoinedListById({ id });
  const {
    data: employee,
    isLoading: employeesLoading,
    error: employeesError,
    refetch: refetchEmployees,
  } = useEmployeeListsByEmployee({ employeeAddress: org?.employee ?? "" });

  const salaryEmployee = useEmployeeSalary({
    employee: employee,
    organization: org,
    updateInterval: 2000,
  });

  const { data: autoEarnData, refetch: refetchAutoEarn } =
    useEnableAutoEarnsByEmployee({
      employeeAddress: org?.employee ?? "",
    });

  const {
    data: withdrawsData,
    isLoading: withdrawsLoading,
    refetch: refetchWithdraws,
  } = useWithdrawsByEmployee({
    employee: org?.employee ?? "",
  });

  if (orgLoading || employeesLoading) {
    return (
      <div className="w-full h-auto max-w-7xl mx-auto p-4 my-5 2xl:p-10">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-10 w-24" />
          </div>

          <div className="flex flex-wrap justify-between gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-2 p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-20" />
              </div>
            ))}
          </div>

          <div className="border rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 border-2 rounded-xl">
                  <div className="flex gap-3 items-center">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex flex-col gap-2 flex-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orgError || employeesError) {
    return (
      <div className="w-full h-auto max-w-7xl mx-auto p-4 my-5 2xl:p-10">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <AlertCircle className="w-16 h-16 text-red-500" />
          <h2 className="text-2xl font-bold text-center">
            Failed to Load Organization
          </h2>
          <p className="text-muted-foreground text-center max-w-md">
            {orgError?.message ||
              "There was an error loading the organization data. Please try again later."}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!org || !employee) {
    return (
      <div className="w-full h-auto max-w-7xl mx-auto p-4 my-5 2xl:p-10">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Building2 className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold text-center">
            Organization Not Found
          </h2>
          <p className="text-muted-foreground text-center max-w-md">
            The organization with ID &quot;{id}&quot; could not be found. It may
            have been deleted or moved.
          </p>
          <Button asChild variant="outline">
            <Link href="/dashboard">Browse Organizations</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="w-full h-auto max-w-7xl mx-auto p-5 my-5 2xl:p-10">
        <div className="flex flex-col gap-6 lg:gap-10">
          <div className="flex flex-col gap-6 lg:gap-10 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:underline transition-all duration-200"
                      href="/dashboard"
                    >
                      <ArrowLeft />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Back to Dashboard</p>
                  </TooltipContent>
                </Tooltip>
                <Image
                  alt={`Organization ${(Number(org?.createdAt ?? 0) % 35) + 1} logo`}
                  className="w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0 rounded-lg"
                  height={72}
                  src={`/images/abstract/${(Number(org?.createdAt ?? 0) % 35) + 1}.jpg`}
                  width={72}
                />
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
                    {org?.name}
                  </h1>
                  {org?.organization ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:underline transition-all duration-200 w-fit"
                          href={urlExplorer({
                            chainId: 84532,
                            address: org.organization,
                          })}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="truncate">
                            {formatAddress(org.organization)}
                          </span>
                          <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View organization contract on blockchain explorer</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No address provided
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <EnableAutoEarnDialog
                      currentSalary={salaryEmployee.currentBalance}
                      isAutoEarnEnabled={employee?.autoEarnStatus ?? false}
                      organizationAddress={org?.organization ?? ""}
                      trigger={
                        <Button className="flex-1 flex items-center justify-center gap-1">
                          <Bot className="w-5 h-5" />
                          <span className="ml-2">Auto Earn</span>
                        </Button>
                      }
                      onSuccess={() => {
                        refetchEmployees();
                        refetch();
                        refetchAutoEarn();
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Use our automated earn feature to manage your salary
                      earnings
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <WithdrawDialog
                      balance={salaryEmployee.currentBalance}
                      organizationAddress={org?.organization ?? ""}
                      onSuccess={() => {
                        refetchEmployees();
                        refetch();
                        refetchWithdraws();
                        refetchAutoEarn();
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Withdraw your accumulated salary balance</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-4 lg:gap-6">
              <div className="flex flex-col gap-2 p-4 rounded-lg border sm:border-0 sm:bg-transparent">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">
                    Period Time
                  </span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        How often salary payments are calculated and distributed
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-3xl sm:text-4xl lg:text-5xl leading-none capitalize">
                  {getPeriodLabel(org?.periodTime ?? "")}
                </span>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-lg border sm:border-0 sm:bg-transparent">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your current employment status in this organization</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl sm:text-4xl lg:text-5xl leading-none">
                    {employee.status === true ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {employee.status === true ? (
                <div className="flex flex-col gap-2 p-4 rounded-lg border sm:border-0 sm:bg-transparent">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">
                      Target Salary This Period
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Your total salary amount for the current pay period
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl sm:text-4xl lg:text-5xl leading-none">
                      $
                      {formatCompactNumber(
                        normalize(employee?.salary ?? "0", 18),
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 p-4 rounded-lg border sm:border-0 sm:bg-transparent">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">
                      Last salary inactive status
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          The date when your employment status became inactive
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl sm:text-4xl lg:text-5xl leading-none">
                      {new Date(
                        employee.lastStatusUpdated * 1000,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              {employee.status === true ? (
                <div className="flex flex-col gap-2 p-4 rounded-lg border sm:border-0 sm:bg-transparent">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">
                      Salary Balance
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Your accumulated salary that can be withdrawn right
                          now
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl sm:text-4xl lg:text-5xl leading-none">
                      $
                      {(() => {
                        const balance = Number(salaryEmployee.currentBalance);

                        return balance >= 1000
                          ? formatCompactNumber(balance)
                          : balance;
                      })()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 p-4 rounded-lg border sm:border-0 sm:bg-transparent">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">
                      Last Compensation Salary
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          The final salary amount you received before becoming
                          inactive
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl sm:text-4xl lg:text-5xl leading-none">
                      $
                      {formatCompactNumber(
                        normalize(employee?.lastCompensationSalary ?? "0", 18),
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AutoEarnCard
                autoEarnData={autoEarnData}
                earnData={earnData}
                employee={employee}
                refetch={() => {
                  refetchEmployees();
                  refetch();
                  refetchWithdraws();
                  refetchAutoEarn();
                }}
              />

              <HistoryCard
                withdrawsData={withdrawsData}
                withdrawsLoading={withdrawsLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
