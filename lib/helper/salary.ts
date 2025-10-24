import { normalize } from "./bignumber";

export const getIncrementalSalary = (
  salary: string | number,
  periodTime: string,
  lastBalanceUpdate: number,
  now: number,
  currentSalaryBalance?: string | number,
  totalWithdrawn?: string | number,
  streamingActive?: boolean,
): string => {
  if (streamingActive === false) {
    return "0.000";
  }

  const normalizedSalary = normalize(salary, 18);
  const normalizedCurrentBalance = normalize(currentSalaryBalance || "0", 18);
  const normalizedTotalWithdrawn = normalize(totalWithdrawn || "0", 18);

  const salaryPerSecond = Number(normalizedSalary) / Number(periodTime);

  const elapsedTimeInSeconds = Math.max(0, now - lastBalanceUpdate);

  const newEarnings = salaryPerSecond * elapsedTimeInSeconds;

  const totalBalance = Number(normalizedCurrentBalance) + newEarnings;

  const availableBalance = Math.max(
    0,
    totalBalance - Number(normalizedTotalWithdrawn),
  );

  return availableBalance.toFixed(3);
};

export const getIncrementalSalaryLegacy = (
  salary: string | number,
  periodTime: string,
  startTimestamp: number,
  now: number,
): string => {
  const normalizedSalary = normalize(salary, 18);

  const elapsedTimeInSeconds = now - startTimestamp;

  const incrementalSalary =
    (Number(normalizedSalary) * elapsedTimeInSeconds) / Number(periodTime);

  return incrementalSalary.toFixed(3);
};
