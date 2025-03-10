import { formatToValidPath } from "@/components/utils";
import { arbitrumSepolia, optimismSepolia, sepolia } from "thirdweb/chains";

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
  {
    chain: arbitrumSepolia,
    path: formatToValidPath(arbitrumSepolia.name!),
    scan: `https://sepolia.arbiscan.io/tx`,
  },
];

export const storageFactoryContractAddress = [
  {
    chain: optimismSepolia,
    address: "0xe71AfF81de4451020a21F7FEF4952B5e6A7EB4c0",
  },
  {
    chain: arbitrumSepolia,
    address: "0xd124F47C397b50cD91e99FbbC98649fe7FD8D2F7",
  },
];

export const fundMeFactoryContractAddress = [
  {
    chain: arbitrumSepolia,
    address: "0x2653cc279e220d6AC5a7c5Eac53b55c1D345C510",
  },
];
