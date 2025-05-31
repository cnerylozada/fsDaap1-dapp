"use server";

import { getContractByChainAndAddress } from "@/contracts/server";
import { AppChainId } from "@/contracts/settings";
import { readContract } from "thirdweb";

export const getCrowdFundingList = async (
  currentChainId: AppChainId,
  contractAddress: string
) => {
  const crowdFundingList = await readContract({
    contract: getContractByChainAndAddress(currentChainId, contractAddress),
    method:
      "function contractsCreated() external view returns ((address, uint, (string, string, uint, address, int))[] memory)",
    params: [],
  });
  return crowdFundingList;
};
