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
