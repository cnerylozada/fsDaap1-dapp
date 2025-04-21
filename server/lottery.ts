"use server";

import { getContractByChainAndAddress } from "@/contracts/server";
import { AppChainId } from "@/contracts/settings";
import { readContract } from "thirdweb";

export const getLotteryList = async (
  chainId: AppChainId,
  contractAddress: string
) => {
  const lotteryList = await readContract({
    contract: getContractByChainAndAddress(chainId, contractAddress),
    method:
      "function contractsCreated() external view returns ((address, uint, (string, string, address, uint, uint, uint, uint))[] memory)",
    params: [],
  });
  return lotteryList;
};
