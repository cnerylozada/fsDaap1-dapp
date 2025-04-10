import {
  chainlinkVRFCoordinatorContracts,
  LINKTokenContracts,
} from "@/contracts/chainlink";
import { getContractByChainAndAddress } from "@/contracts/client";
import { AppChainId } from "@/contracts/settings";
import { useRouter } from "next/navigation";
import { prepareContractCall } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { encodeAbiParameters } from "thirdweb/utils";

export const FundSubscription = ({
  currentChainId,
  subscriptionId,
}: {
  currentChainId: AppChainId;
  subscriptionId: bigint;
}) => {
  const { mutateAsync, isPending } = useSendAndConfirmTransaction();
  const AMOUNT_TO_FUND = BigInt(1 * 10 ** 18);
  const router = useRouter();

  const onFundSubscription = async (subscriptionId: bigint) => {
    const LINKToken = LINKTokenContracts.find(
      (_) => _.chainId === currentChainId
    );
    const VRFCoodinator = chainlinkVRFCoordinatorContracts.find(
      (_) => _.chainId === currentChainId
    );

    const encodeSubId = encodeAbiParameters(
      [{ name: "subId", type: "uint256" }],
      [subscriptionId]
    );
    if (LINKToken && VRFCoodinator) {
      const tx = prepareContractCall({
        contract: getContractByChainAndAddress(
          LINKToken.chainId,
          LINKToken.address
        ),
        method:
          "function transferAndCall(address to, uint value, bytes memory data) public returns (bool success)",
        params: [VRFCoodinator.address, AMOUNT_TO_FUND, encodeSubId],
      });
      await mutateAsync(tx);
      router.refresh();
    }
  };

  return (
    <div>
      <div>
        <button
          className="bg-orange-100 p-2 rounded-md cursor-pointer text-sm"
          onClick={async () => {
            await onFundSubscription(subscriptionId);
          }}
        >
          Fund +1 LINK to subscription
        </button>
      </div>
      {isPending && <div>Loading funding...</div>}
    </div>
  );
};
