import { useState, useEffect, useMemo } from "react";

import { EmployeeItem } from "@/types/graphql/employee.type";
import { OrganizationItem } from "@/types/graphql/organization.type";
import { normalize } from "@/lib/helper/bignumber";

type EmployeeSalaryData = {
  currentBalance: string;
  availableBalance: bigint;
  salaryPerSecond?: bigint;
  timeElapsed?: number;
  isStreaming: boolean;
};

export const useMultipleEmployeeSalaries = ({
  employees,
  organization,
  updateInterval = 2000,
}: {
  employees: EmployeeItem[];
  organization?: OrganizationItem;
  updateInterval?: number;
}) => {
  const [employeeSalaries, setEmployeeSalaries] = useState<
    Record<string, EmployeeSalaryData>
  >({});

  const periodTime = useMemo(
    () => organization?.periodTime,
    [organization?.periodTime],
  );

  const stableEmployees = useMemo(
    () => employees,
    [
      JSON.stringify(
        employees.map((emp) => ({
          id: emp?.id,
          salary: emp?.salary,
          streamingActive: emp?.streamingActive,
          status: emp?.status,
          salaryStreamStartTime: emp?.salaryStreamStartTime,
          createdAt: emp?.createdAt,
          unrealizedSalary: emp?.unrealizedSalary,
          totalWithdrawn: emp?.totalWithdrawn,
        })),
      ),
    ],
  );

  useEffect(() => {
    const calculateAllSalaries = () => {
      const newSalaries: Record<
        string,
        ReturnType<typeof calculateSingleEmployeeSalary>
      > = {};

      stableEmployees.forEach((employee) => {
        if (employee?.id) {
          const salaryData = calculateSingleEmployeeSalary(employee);

          newSalaries[employee.id] = salaryData;
        }
      });

      setEmployeeSalaries((prevSalaries) => {
        const hasChanged = Object.keys(newSalaries).some((id) => {
          const prev = prevSalaries[id];
          const current = newSalaries[id];

          return (
            !prev ||
            prev.currentBalance !== current.currentBalance ||
            prev.availableBalance !== current.availableBalance ||
            prev.isStreaming !== current.isStreaming
          );
        });

        return hasChanged ? newSalaries : prevSalaries;
      });
    };

    const calculateSingleEmployeeSalary = (employee: EmployeeItem) => {
      if (!employee.streamingActive || !employee.status) {
        return {
          currentBalance: String(0),
          availableBalance: BigInt(0),
          isStreaming: false,
        };
      }

      const PERIOD_TIMES = {
        DAILY: 86400,
        WEEKLY: 604800,
        MONTHLY: 2592000,
        YEARLY: 31536000,
      };

      const periodTimeSeconds = periodTime
        ? Number(periodTime)
        : PERIOD_TIMES.MONTHLY;

      const salaryPerSecond =
        BigInt(employee.salary || 0) / BigInt(periodTimeSeconds);
      const currentTime = Math.floor(Date.now() / 1000);
      const streamStartTime =
        employee.salaryStreamStartTime || employee.createdAt;
      const timeElapsed = Math.max(0, currentTime - Number(streamStartTime));

      const streamedEarnings = salaryPerSecond * BigInt(timeElapsed);
      const unrealizedSalary = BigInt(employee.unrealizedSalary || 0);
      const currentBalance = streamedEarnings + unrealizedSalary;
      const totalWithdrawn = BigInt(employee.totalWithdrawn || 0);
      const availableBalance =
        currentBalance > totalWithdrawn
          ? currentBalance - totalWithdrawn
          : BigInt(0);

      return {
        currentBalance: parseFloat(
          normalize(Number(currentBalance), 18),
        ).toFixed(3),
        availableBalance,
        salaryPerSecond,
        timeElapsed,
        isStreaming: true,
      };
    };

    calculateAllSalaries();

    const interval = setInterval(calculateAllSalaries, updateInterval);

    return () => clearInterval(interval);
  }, [stableEmployees, periodTime, updateInterval]);

  return employeeSalaries;
};
