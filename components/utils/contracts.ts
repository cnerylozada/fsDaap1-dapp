import { AppChainId, appNetworkPathRecord } from "@/contracts/settings";

export function formatToken(value: bigint, decimals: number) {
  const divisor = BigInt(10) ** BigInt(decimals);
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;
  const fractionalStr = fractionalPart.toString().padStart(decimals, "0");
  return `${integerPart}.${fractionalStr.slice(0, 5)}`;
}

export const getAppChainIdByPath = (path: string) => {
  const entry = Object.entries(appNetworkPathRecord).filter(
    ([, value]) => value === path
  )[0];
  return +entry[0] as AppChainId;
};
