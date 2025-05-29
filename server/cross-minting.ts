"use server";
import { getContractByChainAndAddress } from "@/contracts/server";
import { AppChainId } from "@/contracts/settings";
import { Hex, readContract } from "thirdweb";

export const verify = async (
  appChainId: AppChainId,
  contractAddress: string,
  proof: Hex[],
  walletAddress: string,
  activeWalletChain: number
) => {
  return readContract({
    contract: getContractByChainAndAddress(appChainId, contractAddress),
    method:
      "function verify(bytes32[] memory _proof, (address,uint256) memory _user) external view returns (bool)",
    params: [proof, [walletAddress, BigInt(activeWalletChain)]],
  });
};

export const getWhiteListCustomers = async (
  chainId: AppChainId,
  contractAddress: string
) => {
  const DBAddress = await readContract({
    contract: getContractByChainAndAddress(chainId, contractAddress),
    method: "function getDBAddress() external view returns (address)",
    params: [],
  });

  const customers = await readContract({
    contract: getContractByChainAndAddress(chainId, DBAddress),
    method:
      "function getUsers() external view returns ((address,uint256)[] memory)",
    params: [],
  });
  return customers;
};
