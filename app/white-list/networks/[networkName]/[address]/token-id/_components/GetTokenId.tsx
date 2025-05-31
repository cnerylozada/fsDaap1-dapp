"use client";

import { useCheckWalletAndNetwork } from "@/components/hooks";
import { getNFTTokenList } from "@/server/cross-minting";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export const GetTokenId = () => {
  const { networkName, address } = useParams();

  const {
    isWalletConnectedToCorrectChain,
    targetAppNetwork,
    appChainId,
    walletAddress,
  } = useCheckWalletAndNetwork(`${networkName}`);

  useEffect(() => {
    if (walletAddress) {
      getNFTTokenList(appChainId, `${address}`, walletAddress).then((_) =>
        console.log(_)
      );
    }
  }, [walletAddress, appChainId]);

  if (!walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  return (
    <div>
      <div></div>
    </div>
  );
};
