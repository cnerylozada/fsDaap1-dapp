import { formatToValidPath } from "@/components/utils";
import { optimismSepolia, sepolia } from "thirdweb/chains";

export const appNetworks = [
  {
    chain: optimismSepolia,
    path: formatToValidPath(optimismSepolia.name!),
    scan: `https://sepolia-optimism.etherscan.io/tx`,
  },
  {
    chain: sepolia,
    path: formatToValidPath(sepolia.name!),
    scan: `https://sepolia.etherscan.io/tx`,
  },
];
export const storageContractAddress = [
  {
    chainId: optimismSepolia.id,
    address: "0x9c55CC433789a94d9f8b170eAdD10ac370599eED",
  },
  {
    chainId: sepolia.id,
    address: "0x09fc0F69F069e71D7C18666A05aB01f4a3375bd6",
  },
];
