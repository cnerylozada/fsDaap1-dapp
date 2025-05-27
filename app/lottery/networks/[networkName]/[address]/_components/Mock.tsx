"use client";
import { getContractByChainAndAddress } from "@/contracts/client";
import { AppChainId } from "@/contracts/settings";
import { useReadContract } from "thirdweb/react";

export const Mock = () => {
  const { data } = useReadContract({
    contract: getContractByChainAndAddress(
      AppChainId.optimismSepolia,
      `0x43480B2988f968437B72cc97EAaEe35Df4dF9044`
    ),
    method: "function getCaller() external view returns (address)",
    params: [],
  });
  return (
    <div>
      <div>Mock</div>
      <div>{data}</div>
    </div>
  );
};
