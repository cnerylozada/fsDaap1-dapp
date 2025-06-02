"use server";

import { getContractByChainAndAddress } from "@/contracts/server";
import { AppChainId } from "@/contracts/settings";
import { readContract } from "thirdweb";

export const getLotteryList = async (
  currentChainId: AppChainId,
  contractAddress: string
) => {
  const lotteryList = await readContract({
    contract: getContractByChainAndAddress(currentChainId, contractAddress),
    method:
      "function getCreatedContractList() external view returns ((address, uint, (string, string, address, uint, uint, uint, uint))[] memory)",
    params: [],
  });
  return lotteryList;
};
