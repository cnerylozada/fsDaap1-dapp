import { thirdwebClientSide } from "@/lib/thirdweb/client";
import { getContract } from "thirdweb";
import { ChainOptions } from "thirdweb/chains";
import { appNetworks, storageFactoryContractAddress } from "./networks";

export const getClientSideContractByChainAndAddress = (
  chain: ChainOptions,
  address: string
) => {
  return getContract({
    client: thirdwebClientSide,
    address,
    chain: appNetworks.filter((_) => _.chain.id === chain.id)[0].chain,
  });
};

export const getStorageFactoryContractClientSideByNetwork = (
  chain: ChainOptions
) => {
  const address = storageFactoryContractAddress.filter(
    (_) => _.chain.id === chain.id
  )[0].address;

  return getClientSideContractByChainAndAddress(chain, address);
};
