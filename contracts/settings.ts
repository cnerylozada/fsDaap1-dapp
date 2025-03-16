import { formatToValidPath } from "@/components/utils/utils";
import {
  arbitrumSepolia,
  ChainOptions,
  optimismSepolia,
  sepolia,
} from "thirdweb/chains";

export enum AppChainId {
  optimismSepolia = 11155420,
  arbitrumSepolia = 421614,
  sepolia = 11155111,
}

export const appNetworkRecord: Record<
  AppChainId,
  Readonly<
    ChainOptions & {
      rpc: string;
    }
  >
> = {
  [AppChainId.optimismSepolia]: optimismSepolia,
  [AppChainId.arbitrumSepolia]: arbitrumSepolia,
  [AppChainId.sepolia]: sepolia,
};

export const appNetworkPathRecord: Record<AppChainId, string> = {
  [AppChainId.optimismSepolia]: formatToValidPath(optimismSepolia),
  [AppChainId.arbitrumSepolia]: formatToValidPath(arbitrumSepolia),
  [AppChainId.sepolia]: formatToValidPath(sepolia),
};

export const appScanURLRecord: Record<AppChainId, string> = {
  [AppChainId.optimismSepolia]: "https://sepolia-optimism.etherscan.io/tx",
  [AppChainId.arbitrumSepolia]: "https://sepolia.arbiscan.io/tx",
  [AppChainId.sepolia]: "https://sepolia.etherscan.io/tx",
};

export interface IAppContact {
  chainId: AppChainId;
  address: string;
  path: string;
}
