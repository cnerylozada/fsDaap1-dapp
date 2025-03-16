"use client";
import { useCheckWalletAndNetwork } from "@/components/hooks";
import { getActiveSubscriptionsByChainAndWallet } from "@/server/vrf-subscription";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubscriptionDetail } from "./SubscriptionDetail";
import Link from "next/link";

export const ActiveSubscriptions = () => {
  const { networkName } = useParams();
  const {
    targetAppNetwork,
    walletAddress,
    isWalletConnectedToCorrectChain,
    appChainId,
  } = useCheckWalletAndNetwork(`${networkName}`);

  const [isLoading, setIsLoading] = useState(true);
  const [activeSubscriptions, setActiveSubscriptions] = useState<
    bigint[] | null
  >(null);

  const fetchActiveSubscriptions = async (walletAddress: string) => {
    if (targetAppNetwork) {
      setIsLoading(true);
      const response = await getActiveSubscriptionsByChainAndWallet(
        targetAppNetwork.id,
        walletAddress
      );
      setActiveSubscriptions(response);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchActiveSubscriptions(walletAddress);
    }
  }, [walletAddress]);

  if (!walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  return (
    <div>
      {isLoading ? (
        <div>Loading subscriptions ...</div>
      ) : (
        <div className="space-y-4">
          {activeSubscriptions && activeSubscriptions.length ? (
            activeSubscriptions.map((_) => (
              <SubscriptionDetail
                key={`${_}`}
                currentChainId={appChainId}
                subscriptionId={_}
              />
            ))
          ) : (
            <div className="space-y-4">
              <div>No active subscriptions found</div>
              <div>
                <Link
                  href={`../${networkName}/new-subscription`}
                  className="p-2 bg-blue-100 rounded-md"
                >
                  Create Subscription
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
