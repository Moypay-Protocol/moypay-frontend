import React from "react";

import { useCurrentSalary } from "@/hooks/query/contract/use-current-salary";

export default function IncrementalSalary({
  organizationAddress,
  employeeAddress,
  className = "",
  text = "",
}: {
  organizationAddress: HexAddress;
  employeeAddress: HexAddress;
  className?: string;
  text?: string;
}) {
  const { currentSalary } = useCurrentSalary({
    organizationAddress,
    employeeAddress,
  });

  return <span className={className}>{`${text}${currentSalary}`}</span>;
}
