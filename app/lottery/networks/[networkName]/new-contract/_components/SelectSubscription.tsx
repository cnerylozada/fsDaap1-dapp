"use client";
import { getActiveSubscriptionsByChainAndWallet } from "@/server/vrf-subscription";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubscriptionDetail } from "./SubscriptionDetail";
import { AppChainId, appNetworkPathRecord } from "@/contracts/settings";
import Link from "next/link";
import { IManageCreation } from "./LotteryCreationFlow";

export const SelectSubscription = ({
  walletAddress,
  currentChainId,
  setManageCreation,
}: {
  walletAddress: string;
  currentChainId: AppChainId;
  setManageCreation: Dispatch<SetStateAction<IManageCreation>>;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubscriptions, setActiveSubscriptions] = useState<
    bigint[] | null
  >(null);

  const fetchActiveSubscriptions = async (
    walletAddress: string,
    chainId: AppChainId
  ) => {
    setIsLoading(true);
    const response = await getActiveSubscriptionsByChainAndWallet(
      chainId,
      walletAddress
    );
    setActiveSubscriptions(response);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchActiveSubscriptions(walletAddress, currentChainId);
  }, []);

  return (
    <div>
      <div className="mb-2">
        Check the funds in your subscriptions then select one with at least 1
        LINK token
      </div>
      {isLoading ? (
        <div>Loading subscriptions ...</div>
      ) : (
        <div className="space-y-4">
          {activeSubscriptions && activeSubscriptions.length ? (
            activeSubscriptions.map((_) => (
              <SubscriptionDetail
                key={_}
                currentChainId={currentChainId}
                subscriptionId={_}
                setManageCreation={setManageCreation}
              />
            ))
          ) : (
            <div className="space-y-4">
              <div>No active subscriptions found</div>
              <div>
                <Link
                  href={`../${appNetworkPathRecord[currentChainId]}/new-subscription`}
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
