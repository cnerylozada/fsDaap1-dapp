import { formatToken } from "@/components/utils/contracts";
import { AppChainId } from "@/contracts/settings";
import { getSubscriptionDetailByChainAndId } from "@/server/actions";
import { useState } from "react";
import { shortenHex, toEther } from "thirdweb/utils";

export const SubscriptionDetail = ({
  appChainId,
  subscriptionId,
}: {
  appChainId: AppChainId;
  subscriptionId: bigint;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState<{
    balance: bigint;
    nativeBalance: bigint;
  } | null>(null);

  const fetchDetailById = async (subscriptionId: bigint) => {
    setIsLoading(true);
    setDetail(null);
    setError("");
    const { error, subscription } = await getSubscriptionDetailByChainAndId(
      appChainId,
      subscriptionId
    );
    if (!!error) setError(JSON.stringify(error));
    else if (!!subscription)
      setDetail({ balance: subscription[0], nativeBalance: subscription[1] });
    setIsLoading(false);
  };

  return (
    <div className="p-2 border rounded-md">
      <div className="flex items-center justify-between">
        <div>Subscription: {shortenHex(subscriptionId.toString())}</div>
        <div>
          <button
            className="bg-blue-100 p-2 rounded-md cursor-pointer"
            onClick={async () => {
              await fetchDetailById(subscriptionId);
            }}
          >
            Show detail
          </button>
        </div>
      </div>
      <div>
        {isLoading && <div>Loading ...</div>}
        {detail && (
          <div className="text-sm">
            <div>Balance: {formatToken(detail.balance, 18)} LINK</div>
            <div>Native balance: {toEther(detail.nativeBalance)} ETH</div>
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
