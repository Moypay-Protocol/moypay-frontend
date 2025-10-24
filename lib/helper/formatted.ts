export const formatNumber = (val: string) => {
  const num = Number(val.replace(/,/g, ""));

  if (isNaN(num)) return "";

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
};

export const formatNumberWithComma = (value: string): string => {
  const number = parseFloat(value.replace(/,/g, ""));

  if (isNaN(number)) return "";

  return number.toLocaleString("en-US", { maximumFractionDigits: 6 });
};
