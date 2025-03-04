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
    address: "0x1bc57f55070Bd358A36e7B4ebFd266f6a78376ef",
  },
  { chain: sepolia, address: "0x1859164F9778565a7fe479b349B4A1aD8A7608D7" },
];
