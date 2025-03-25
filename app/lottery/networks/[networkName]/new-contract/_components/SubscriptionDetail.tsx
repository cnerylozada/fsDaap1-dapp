import { formatToken } from "@/components/utils/contracts";
import { AppChainId } from "@/contracts/settings";
import { getSubscriptionDetailByChainAndId } from "@/server/vrf-subscription";
import { useState } from "react";
import { shortenHex, toEther } from "thirdweb/utils";
import { FundSubscription } from "./FundSubscription";

export const SubscriptionDetail = ({
  currentChainId,
  subscriptionId,
}: {
  currentChainId: AppChainId;
  subscriptionId: bigint;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [detail, setDetail] = useState<{
    balance: bigint;
    nativeBalance: bigint;
  } | null>(null);
  const [error, setError] = useState("");

  const fetchDetailById = async (subscriptionId: bigint) => {
    setIsLoading(true);
    const { error, subscription } = await getSubscriptionDetailByChainAndId(
      currentChainId,
      subscriptionId
    );
    if (!!error) setError(JSON.stringify(error));
    else if (!!subscription)
      setDetail({ balance: subscription[0], nativeBalance: subscription[1] });
    setIsLoading(false);
  };

  const MINIMUM_LINK_BALANCE = BigInt(1 * 10 ** 18);

  return (
    <div className="p-2 border rounded-md space-y-3">
      <div className="md:flex md:items-center md:justify-between">
        <div className="mb-2">
          Subscription: {shortenHex(subscriptionId.toString())}
        </div>
        <div className="text-right md:text-left">
          <button
            className="bg-blue-100 p-2 rounded-md cursor-pointer text-sm"
            onClick={async () => {
              await fetchDetailById(subscriptionId);
            }}
          >
            Show detail | Refresh
          </button>
        </div>
      </div>
      <div>
        {isLoading && <div>Loading detail ...</div>}
        {!isLoading && detail && (
          <div>
            <div className="mb-2 text-sm">
              <div>Balance: {formatToken(detail.balance, 18)} LINK</div>
              <div>Native balance: {toEther(detail.nativeBalance)} ETH</div>
            </div>
            <div>
              {detail.balance >= MINIMUM_LINK_BALANCE ? (
                <div className="text-right">
                  <button
                    className="bg-green-100 p-2 rounded-md cursor-pointer text-sm"
                    onClick={() => {
                      console.log(`...`);
                    }}
                  >
                    Select subscription and continue
                  </button>
                </div>
              ) : (
                <div className="text-sm">
                  <div className="mb-1">
                    Not enough LINKs to create a lottery
                  </div>
                  <FundSubscription
                    currentChainId={currentChainId}
                    subscriptionId={subscriptionId}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        {error && (
          <div className="text-sm">
            <div className="text-red-700">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};
