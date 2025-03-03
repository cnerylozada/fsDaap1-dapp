import { thirdwebServerSide } from "@/lib/thirdweb/server";
import { getContract } from "thirdweb";
import { ChainOptions } from "thirdweb/chains";
import { appNetworks, storageContractAddress } from "./networks";

export const getStorageContractServerSideByNetwork = (chain: ChainOptions) => {
  const address = storageContractAddress.filter(
    (_) => _.chainId === chain.id
  )[0].address;

  return getContract({
    client: thirdwebServerSide,
    address,
    chain: appNetworks.filter((_) => _.chain === chain)[0].chain,
  });
};
