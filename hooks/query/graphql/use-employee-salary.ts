import { useState, useEffect, useCallback, useMemo } from "react";

import { EmployeeItem } from "@/types/graphql/employee.type";
import { OrganizationItem } from "@/types/graphql/organization.type";
import { normalize } from "@/lib/helper/bignumber";

const PERIOD_TIMES = {
  DAILY: 86400,
  WEEKLY: 604800,
  MONTHLY: 2592000,
  YEARLY: 31536000,
};

export const useEmployeeSalary = ({
  employee,
  organization,
  updateInterval = 1000,
}: {
  employee: EmployeeItem;
  organization?: OrganizationItem;
  updateInterval?: number;
}) => {
  const [salaryData, setSalaryData] = useState({
    currentBalance: String(0),
    availableBalance: BigInt(0),
    salaryPerSecond: BigInt(0),
    timeElapsed: 0,
    totalEarned: BigInt(0),
    isStreaming: false,
  });

  const periodTime = useMemo(
    () => organization?.periodTime,
    [organization?.periodTime],
  );

  const stableEmployee = useMemo(
    () => ({
      id: employee?.id,
      salary: employee?.salary,
      streamingActive: employee?.streamingActive,
      status: employee?.status,
      salaryStreamStartTime: employee?.salaryStreamStartTime,
      createdAt: employee?.createdAt,
      unrealizedSalary: employee?.unrealizedSalary,
      totalWithdrawn: employee?.totalWithdrawn,
      totalEarned: employee?.totalEarned,
    }),
    [
      employee?.id,
      employee?.salary,
      employee?.streamingActive,
      employee?.status,
      employee?.salaryStreamStartTime,
      employee?.createdAt,
      employee?.unrealizedSalary,
      employee?.totalWithdrawn,
      employee?.totalEarned,
    ],
  );

  const calculateCurrentSalary = useCallback(() => {
    if (
      !stableEmployee ||
      !stableEmployee.streamingActive ||
      !stableEmployee.status
    ) {
      return {
        currentBalance: String(0),
        availableBalance: BigInt(0),
        salaryPerSecond: BigInt(0),
        timeElapsed: 0,
        totalEarned: BigInt(stableEmployee?.totalEarned || 0),
        isStreaming: false,
      };
    }

    try {
      const periodTimeSeconds = periodTime
        ? Number(periodTime)
        : PERIOD_TIMES.MONTHLY;

      const salaryPerSecond =
        BigInt(stableEmployee.salary || 0) / BigInt(periodTimeSeconds);

      const currentTime = Math.floor(Date.now() / 1000);
      const streamStartTime =
        stableEmployee.salaryStreamStartTime || stableEmployee.createdAt;
      const timeElapsed = Math.max(0, currentTime - Number(streamStartTime));

      const streamedEarnings = salaryPerSecond * BigInt(timeElapsed);

      const unrealizedSalary = BigInt(stableEmployee.unrealizedSalary || 0);
      const currentBalance = streamedEarnings + unrealizedSalary;

      const totalEarned =
        streamedEarnings + BigInt(stableEmployee.totalEarned || 0);

      const totalWithdrawn = BigInt(stableEmployee.totalWithdrawn || 0);
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
        totalEarned,
        isStreaming: true,
      };
    } catch {
      return {
        currentBalance: String(0),
        availableBalance: BigInt(0),
        salaryPerSecond: BigInt(0),
        timeElapsed: 0,
        totalEarned: BigInt(0),
        isStreaming: false,
      };
    }
  }, [stableEmployee, periodTime]);

  useEffect(() => {
    const updateSalaryData = () => {
      const newSalaryData = calculateCurrentSalary();

      setSalaryData((prevData) => {
        const hasChanged =
          prevData.currentBalance !== newSalaryData.currentBalance ||
          prevData.availableBalance !== newSalaryData.availableBalance ||
          prevData.salaryPerSecond !== newSalaryData.salaryPerSecond ||
          prevData.timeElapsed !== newSalaryData.timeElapsed ||
          prevData.totalEarned !== newSalaryData.totalEarned ||
          prevData.isStreaming !== newSalaryData.isStreaming;

        return hasChanged ? newSalaryData : prevData;
      });
    };

    updateSalaryData();

    const interval = setInterval(updateSalaryData, updateInterval);

    return () => clearInterval(interval);
  }, [calculateCurrentSalary, updateInterval]);

  return salaryData;
};
