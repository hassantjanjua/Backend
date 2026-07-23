export const generateAccountNumber = (): string => {
  const group = () => Math.floor(1000 + Math.random() * 9000);
  return `${group()} ${group()} ${group()}`;
};

export const generateCardNumber = (): string => {
  const group = () => Math.floor(1000 + Math.random() * 9000);
  return `${group()} ${group()} ${group()} ${group()}`;
};

export const generateExpiry = (yearsFromNow = 4): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String((now.getFullYear() + yearsFromNow) % 100).padStart(
    2,
    "0",
  );
  return `${month}/${year}`;
};
