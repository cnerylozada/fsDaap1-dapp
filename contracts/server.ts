import { getContract } from "thirdweb";
import { AppChainId, appNetworkRecord } from "./settings";
import { thirdwebServerSide } from "@/lib/thirdweb/server";

export const getContractByChainAndAddress = (
  chain: AppChainId,
  address: string
) => {
  return getContract({
    client: thirdwebServerSide,
    address,
    chain: appNetworkRecord[chain],
  });
};
