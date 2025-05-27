"use server";
import { getContractByChainAndAddress } from "@/contracts/server";
import { IAppContract } from "@/contracts/settings";
import { readContract } from "thirdweb";

export const getSessionIdByWallet = async (
  contract: IAppContract,
  walletAddress: string
) => {
  const response = await readContract({
    contract: getContractByChainAndAddress(contract.chainId, contract.address),
    method:
      "function getSessionIdByWalletAddress(address _walletAddress) external view returns (string memory)",
    params: [walletAddress],
  });
  return response;
};
