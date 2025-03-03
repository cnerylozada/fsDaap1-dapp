import { thirdwebClientSide } from "@/lib/thirdweb/client";
import { getContract } from "thirdweb";
import { ChainOptions } from "thirdweb/chains";
import { appNetworks, storageContractAddress } from "./networks";

export const getStorageContractClientSideByNetwork = (chain: ChainOptions) => {
  const address = storageContractAddress.filter(
    (_) => _.chainId === chain.id
  )[0].address;

  return getContract({
    client: thirdwebClientSide,
    chain: appNetworks.filter((_) => _.chain.name === chain.name)[0].chain,
    address,
  });
};
