"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  Settings,
  AlertCircle,
  Users,
  Building2,
  ArrowLeft,
  SquarePen,
  ArrowDown,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useAccount } from "wagmi";

import EmployeeCreator from "./dialog/employee-creator";
import DepositDialog from "./dialog/deposit";
import ModifyEmployee from "./dialog/modify-employee";
import OrganizationSettings from "./dialog/organization-settings";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOrganizationListById } from "@/hooks/query/graphql/use-organization-list-by-id";
import { normalize } from "@/lib/helper/bignumber";
import { useEmployeeListsByOrganization } from "@/hooks/query/graphql/use-employee-lists-by-organization";
import { formatCompactNumber } from "@/lib/helper/number";
import { formatAddress, urlExplorer } from "@/lib/helper/web3";
import { getPeriodLabel } from "@/lib/helper/period";
import { Badge } from "@/components/ui/badge";
import { useMultipleEmployeeSalaries } from "@/hooks/query/graphql/use-multiple-employee-salaries";

interface OrganizationProps {
  id: string;
}

export default function Organization({ id }: OrganizationProps) {
  const { address: userAddress } = useAccount();

  const {
    data: org,
    isLoading: orgLoading,
    error: orgError,
    refetch,
  } = useOrganizationListById({ id });
  const {
    data: emp,
    isLoading: empLoading,
    error: empError,
    refetch: refetchEmployees,
  } = useEmployeeListsByOrganization({
    organizationAddress: org?.organization ?? "",
    enabled: !!org?.organization,
  });

  const employeeSalaries = useMultipleEmployeeSalaries({
    employees: emp,
    organization: org,
  });

  if (orgLoading) {
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

  if (orgError) {
    return (
      <div className="w-full h-auto max-w-7xl mx-auto p-4 my-5 2xl:p-10">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <AlertCircle className="w-16 h-16 text-red-500" />
          <h2 className="text-2xl font-bold text-center">
            Failed to Load Organization
          </h2>
          <p className="text-muted-foreground text-center max-w-md">
            {orgError.message ||
              "There was an error loading the organization data. Please try again later."}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!org || org.owner !== userAddress) {
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
      <div className="w-full h-auto max-w-7xl mx-auto p-4 my-5 2xl:p-10">
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
                  onError={(e) => {
                    e.currentTarget.src = "/images/default-org.png";
                  }}
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
                            chainId: 1114,
                            address: org.organization,
                          })}
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
                    <DepositDialog
                      organizationAddress={org?.organization ?? ""}
                      refetch={() => {
                        refetch();
                        refetchEmployees();
                      }}
                      trigger={
                        <Button className="flex-1 flex items-center justify-center gap-1">
                          <ArrowDown className="w-5 h-5" />
                          <span className="ml-2">Deposit</span>
                        </Button>
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add funds to pay employee salaries</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <OrganizationSettings
                      currentPeriodTime={org?.periodTime}
                      organizationAddress={org?.organization ?? ""}
                      trigger={
                        <Button className="flex-1 flex items-center justify-center gap-1">
                          <Settings className="w-5 h-5" />
                          <span className="ml-2">Settings</span>
                        </Button>
                      }
                      onSuccess={() => {
                        refetch();
                        refetchEmployees();
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Configure organization settings</p>
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
                    <TooltipTrigger asChild>
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
                  <span className="text-sm text-muted-foreground">
                    Total Active Employees
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Number of active employees vs total employees in your
                        organization
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl sm:text-4xl lg:text-5xl leading-none">
                    {org?.activeEmployees ?? "0"} / {org?.totalEmployees ?? "0"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-lg border sm:border-0 sm:bg-transparent">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">
                    Deposited Balance
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Total funds available in your organization for salary
                        payments
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl lg:text-5xl leading-none">
                    $
                    {formatCompactNumber(
                      normalize(org?.totalDeposits ?? "0", 18),
                    )}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-lg border sm:border-0 sm:bg-transparent">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">
                    Outstanding Salary
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Amount owed to employees. Red means insufficient funds,
                        green means fully funded
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-3xl sm:text-4xl lg:text-5xl leading-none ${Number(org?.shortfall ?? "0") > 0 ? "text-destructive" : "text-green-500"}`}
                  >
                    ${formatCompactNumber(normalize(org?.shortfall ?? "0", 18))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex border rounded-2xl w-full h-fit min-h-[200px] p-4 sm:p-5">
            <div className="flex flex-col gap-6 w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    List Employee
                  </h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Manage your organization&#39;s employees, their
                        salaries,
                        <br />
                        and status
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <EmployeeCreator
                        emp={emp}
                        organizationAddress={
                          (org?.organization as HexAddress) ?? ""
                        }
                        refetch={() => {
                          refetch();
                          refetchEmployees();
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add a new employee to your organization</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {empLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 border-2 rounded-xl">
                      <div className="flex gap-3 items-center">
                        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {empError && !empLoading && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <AlertCircle className="w-12 h-12 text-red-500" />
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">
                      Failed to Load Employees
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {empError.message ||
                        "There was an error loading employee data."}
                    </p>
                  </div>
                </div>
              )}

              {!empLoading && !empError && (!emp || emp.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Users className="w-12 h-12 text-muted-foreground" />
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">No Employees Yet</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Start building your team by adding your first employee.
                    </p>
                  </div>
                </div>
              )}

              {!empLoading && !empError && emp && emp.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {emp.map((employee) => (
                    <div
                      key={employee.id}
                      className="p-4 border border-b-muted-foreground hover:border-primary transition-all duration-200 rounded-2xl flex flex-col gap-4 min-w-0 cursor-pointer hover:shadow-md"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <Image
                          alt={`Employee ${Number(employee.createdAt) % 36} avatar`}
                          className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                          height={48}
                          src={`/images/abstract2/${Number(employee.createdAt) % 15}.jpg`}
                          width={48}
                          onError={(e) => {
                            e.currentTarget.src = "/images/default-avatar.png";
                          }}
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-semibold text-base truncate">
                            {employee.name || "Unnamed Employee"}
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary hover:underline transition-all duration-200 w-fit truncate"
                                href={urlExplorer({
                                  chainId: 1114,
                                  address: employee.employee,
                                })}
                                target="_blank"
                              >
                                <span className="truncate">
                                  {formatAddress(employee.employee)}
                                </span>
                                <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View employee wallet on blockchain explorer</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              {employee.status === true
                                ? "Salary: "
                                : "Last salary: "}
                              $
                              {formatCompactNumber(
                                normalize(employee.salary ?? "0", 18),
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {employee.status === true
                                ? "Employee's current salary per period"
                                : "Employee's last active salary amount"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                        {employee.status === true && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                Accumulated salary: $
                                {(() => {
                                  const balance =
                                    employeeSalaries[employee.id]
                                      ?.currentBalance;

                                  return Number(balance) >= 1000
                                    ? formatCompactNumber(balance)
                                    : balance;
                                })()}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Employee&#39;s accumulated salary that can be
                                withdrawn now
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant={
                                employee.status === true
                                  ? "success"
                                  : "destructive"
                              }
                            >
                              {employee.status === true
                                ? "Active"
                                : employee.status === false
                                  ? "Inactive"
                                  : "Unknown"}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {employee.status === true
                                ? "Employee is currently active and earning salary"
                                : "Employee is inactive and not earning salary"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      <div className="flex gap-2 mt-2 w-full">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ModifyEmployee
                              currentName={employee.name || ""}
                              currentSalary={Number(
                                normalize(employee.salary, 18),
                              )}
                              currentStatus={employee.status}
                              employeeAddress={employee.employee as HexAddress}
                              organizationAddress={
                                org?.organization as HexAddress
                              }
                              refetch={refetch}
                              trigger={
                                <Button
                                  className="flex-1 flex items-center justify-center gap-1"
                                  variant="default"
                                >
                                  <SquarePen className="w-3 h-3" />
                                  <span className="text-xs">Modify</span>
                                </Button>
                              }
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Update employee&#39;s salary or
                              activate/deactivate them
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
