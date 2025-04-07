"use client";
import { useCheckWalletAndNetwork } from "@/components/hooks";
import { appNetworkRecord } from "@/contracts/settings";
import { useParams } from "next/navigation";
import { useSwitchActiveWalletChain } from "thirdweb/react";
import { ManageCreation } from "./ManageCreation";

export const LotteryCreationFlow = () => {
  const { networkName } = useParams();

  const {
    isWalletConnectedToCorrectChain,
    targetAppNetwork,
    walletAddress,
    appChainId,
  } = useCheckWalletAndNetwork(`${networkName}`);

  const switchChain = useSwitchActiveWalletChain();

  if (!walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        <div>
          Connect your wallet to {targetAppNetwork?.name} to perform operations
        </div>
        {!!walletAddress && (
          <div>
            <button
              className="bg-blue-100 p-2 rounded-md cursor-pointer text-sm"
              onClick={() => switchChain(appNetworkRecord[appChainId])}
            >
              Switch to {targetAppNetwork?.name}
            </button>
          </div>
        )}
      </div>
    );

  return (
    <ManageCreation walletAddress={walletAddress} currentChainId={appChainId} />
  );
};
