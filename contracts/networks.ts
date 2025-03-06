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

export const storageFactoryContractAddress = [
  {
    chain: optimismSepolia,
    address: "0xe71AfF81de4451020a21F7FEF4952B5e6A7EB4c0",
  },
  { chain: sepolia, address: "0x78b0bFFca466232BA064E98a5476E9E272888B63" },
];
