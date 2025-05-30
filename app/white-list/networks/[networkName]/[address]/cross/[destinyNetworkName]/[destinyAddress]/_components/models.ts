import { AppChainId } from "@/contracts/settings";

export interface IToken {
  rawAmount: bigint;
  formattedAmount: number;
  tokenDecimals: number;
  tokenAddress: string;
  chainId: AppChainId;
}
