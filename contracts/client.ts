import { thirdwebClientSide } from "@/lib/thirdweb/client";
import { getContract } from "thirdweb";
import { AppChainId, appNetworkRecord } from "./settings";

export const getContractByChainAndAddress = (
  chain: AppChainId,
  address: string
) => {
  return getContract({
    client: thirdwebClientSide,
    address,
    chain: appNetworkRecord[chain],
  });
};
