import { getContractByChainAndAddress } from "@/contracts/client";
import { chainlinkVRFCoordinatorContracts } from "@/contracts/contracts";
import { AppChainId } from "@/contracts/settings";
import { prepareContractCall, toWei } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import {} from "thirdweb/utils";

export const FundSubscription = ({
  currentChainId,
  subscriptionId,
}: {
  currentChainId: AppChainId;
  subscriptionId: bigint;
}) => {
  const { mutate, isPending } = useSendAndConfirmTransaction();
  const AMOUNT_TO_FUND = "0.003";

  const onFundSubscription = async (subscriptionId: bigint) => {
    const appContract = chainlinkVRFCoordinatorContracts.filter(
      (_) => _.chainId === currentChainId
    )[0];
    const tx = prepareContractCall({
      contract: getContractByChainAndAddress(
        appContract.chainId,
        appContract.address
      ),
      method:
        "function fundSubscriptionWithNative(uint256 subId) external payable",
      params: [subscriptionId],
      value: toWei(AMOUNT_TO_FUND),
    });
    mutate(tx);
  };

  return (
    <div>
      <div className="text-right">
        <button
          className="bg-blue-100 p-2 rounded-md cursor-pointer text-sm"
          onClick={async () => {
            await onFundSubscription(subscriptionId);
          }}
        >
          Fund {AMOUNT_TO_FUND} ETH
        </button>
      </div>
      <div>{isPending && <div>Loading ...</div>}</div>
    </div>
  );
};
