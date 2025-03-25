import {
  chainlinkVRFCoordinatorContracts,
  chainlinkVRFSupportedNetworks,
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
    const network = chainlinkVRFSupportedNetworks.filter(
      (_) => _.chainId === currentChainId
    )[0];
    const VRFCoodinator = chainlinkVRFCoordinatorContracts.filter(
      (_) => _.chainId === currentChainId
    )[0];

    const encodeSubId = encodeAbiParameters(
      [{ name: "subId", type: "uint256" }],
      [subscriptionId]
    );
    const tx = prepareContractCall({
      contract: getContractByChainAndAddress(
        network.chainId,
        network.LINKToken
      ),
      method:
        "function transferAndCall(address to, uint value, bytes memory data) public returns (bool success)",
      params: [VRFCoodinator.address, AMOUNT_TO_FUND, encodeSubId],
    });
    await mutateAsync(tx);
    router.refresh();
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
