"use client";

import { useCheckWalletAndNetwork } from "@/components/hooks";
import { getContractByChainAndAddress } from "@/contracts/client";
import { useParams, useRouter } from "next/navigation";
import { prepareContractCall } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";

export const PurchaseTicket = ({ ticketPrice }: { ticketPrice: bigint }) => {
  const { networkName, address } = useParams();
  const {
    isWalletConnectedToCorrectChain,
    targetAppNetwork,
    appChainId,
    walletAddress,
  } = useCheckWalletAndNetwork(`${networkName}`);

  const { mutateAsync, data, isPending, isSuccess, error } =
    useSendAndConfirmTransaction();

  const router = useRouter();

  if (!walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  const onPurchaseTicket = async () => {
    const tx = prepareContractCall({
      contract: getContractByChainAndAddress(appChainId, `${address}`),
      method: "function purchaseTicket() external payable",
      params: [],
      value: ticketPrice,
    });
    await mutateAsync(tx);
    router.refresh();
  };

  return (
    <div>
      <div>
        <button
          className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
          disabled={isPending}
          onClick={() => {
            onPurchaseTicket();
          }}
        >
          Purchase 1 ticket
        </button>
      </div>
    </div>
  );
};
