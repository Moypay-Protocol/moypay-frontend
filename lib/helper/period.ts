import { PERIOD_LABELS, PERIOD_TIMES } from "../constants";

export const getPeriodLabel = (periodValue: string | number): string => {
  if (typeof periodValue === "string" && periodValue in PERIOD_TIMES) {
    return periodValue;
  }

  const matchedEntry = Object.entries(PERIOD_TIMES).find(
    ([_, value]) => Number(periodValue) === value,
  );

  return matchedEntry
    ? PERIOD_LABELS[matchedEntry[0] as keyof typeof PERIOD_LABELS]
    : "Custom";
};
