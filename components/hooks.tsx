import { appNetworkRecord } from "@/contracts/settings";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { getAppChainIdByPath } from "./utils/contracts";

export const useCheckWalletAndNetwork = (chainName: string) => {
  const appChainId = getAppChainIdByPath(chainName);
  const targetAppNetwork = appNetworkRecord[appChainId];

  const activeAccount = useActiveAccount();
  const activeWalletChain = useActiveWalletChain();

  const isWalletConnectedToCorrectChain =
    activeAccount &&
    activeWalletChain &&
    activeWalletChain.id === targetAppNetwork.id;

  return {
    appChainId,
    walletAddress: activeAccount?.address,
    isWalletConnectedToCorrectChain,
    targetAppNetwork,
  };
};
