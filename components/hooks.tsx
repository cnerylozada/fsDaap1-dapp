import { appNetworks } from "@/contracts/networks";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";

export const useCheckWalletAndChainConnection = (chainName: string) => {
  const contractChain = appNetworks.filter((item) => item.path === chainName)[0]
    .chain;
  const activeAccount = useActiveAccount();
  const activeWalletChain = useActiveWalletChain();

  const isWalletConnectedToCorrectChain =
    activeAccount &&
    activeWalletChain &&
    activeWalletChain.id === contractChain.id;

  return { isWalletConnectedToCorrectChain };
};
