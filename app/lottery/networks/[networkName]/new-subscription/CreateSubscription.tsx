"use client";
import { getContractByChainAndAddress } from "@/contracts/client";
import { AppChainId, appScanURLRecord } from "@/contracts/settings";
import { prepareContractCall } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import Link from "next/link";
import { shortenHex } from "thirdweb/utils";
import { chainlinkVRFCoordinatorContracts } from "@/contracts/chainlink";

export const CreateSubscription = ({
  currentChainId,
}: {
  currentChainId: AppChainId;
}) => {
  const { mutate, isPending, data, isSuccess, error, isError } =
    useSendAndConfirmTransaction();

  const onCreateSubscription = async () => {
    const appContract = chainlinkVRFCoordinatorContracts.filter(
      (_) => _.chainId === currentChainId
    )[0];
    const tx = prepareContractCall({
      contract: getContractByChainAndAddress(
        appContract.chainId,
        appContract.address
      ),
      method: "function createSubscription() external returns (uint256 subId)",
      params: [],
    });
    mutate(tx);
  };
  return (
    <div className="space-y-4">
      <div>
        <button
          disabled={isPending}
          onClick={() => {
            onCreateSubscription();
          }}
          className="p-2 bg-blue-100 rounded-md cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200"
        >
          Create Subscription
        </button>
      </div>
      <div>
        {isPending && <div>Loading ...</div>}
        {isSuccess && data && (
          <div>
            <div>
              Check your transaction:{" "}
              <Link
                href={`${appScanURLRecord[currentChainId]}/${data.transactionHash}`}
                target="_blank"
                className="text-blue-700 text-sm underline"
              >
                Transaction Hash: {shortenHex(data.transactionHash)}
              </Link>
            </div>
            <div>
              <Link href={"./new-contract"} className="underline">
                Return to my subscriptions
              </Link>
            </div>
          </div>
        )}
        {isError && <div className="text-sm text-red-700">{error.message}</div>}
      </div>
    </div>
  );
};
