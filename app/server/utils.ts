import { appNetworks } from "@/contracts/networks";
import { ChainOptions } from "thirdweb/chains";

export const getAppContractByChain = (
  contractApptList: {
    chain: Readonly<
      ChainOptions & {
        rpc: string;
      }
    >;
    address: string;
  }[],
  chainName: string
) => {
  const appContract = contractApptList
    .map((_) => ({
      address: _.address,
      ...appNetworks.filter((item) => item.chain === _.chain)[0],
    }))
    .find((_) => _.path === chainName);

  return appContract;
};
