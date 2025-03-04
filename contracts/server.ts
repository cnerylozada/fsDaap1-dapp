import { thirdwebServerSide } from "@/lib/thirdweb/server";
import { getContract } from "thirdweb";
import { ChainOptions } from "thirdweb/chains";
import { appNetworks, storageFactoryContractAddress } from "./networks";

export const getServerSideContractByChainAndAddress = (
  chain: ChainOptions,
  address: string
) => {
  return getContract({
    client: thirdwebServerSide,
    address,
    chain: appNetworks.filter((_) => _.chain === chain)[0].chain,
  });
};

export const getStorageFactoryContractServerSideByNetwork = (
  chain: ChainOptions
) => {
  const address = storageFactoryContractAddress.filter(
    (_) => _.chain.id === chain.id
  )[0].address;

  return getServerSideContractByChainAndAddress(chain, address);
};
