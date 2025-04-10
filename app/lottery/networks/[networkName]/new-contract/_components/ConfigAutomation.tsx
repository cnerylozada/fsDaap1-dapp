import { useSendAndConfirmTransaction } from "thirdweb/react";
import { IManageCreation } from "./LotteryCreationFlow";
import { prepareContractCall, toWei } from "thirdweb";
import { getContractByChainAndAddress } from "@/contracts/client";
import { AppChainId, appScanURLRecord } from "@/contracts/settings";
import { lotteryFactoryContracts } from "@/contracts/contracts";
import { chainlinkVRFCoordinatorContracts } from "@/contracts/chainlink";
import Link from "next/link";
import { shortenHex } from "thirdweb/utils";

export const ConfigAutomation = ({
  manageCreation,
  currentChainId,
}: {
  manageCreation: IManageCreation;
  currentChainId: AppChainId;
}) => {
  const { data, mutate, isPending, isSuccess, isError, error } =
    useSendAndConfirmTransaction();

  const { metadata, subscriptionId } = manageCreation;

  const onCreateLottery = async () => {
    const lotteryFactory = lotteryFactoryContracts.find(
      (_) => _.chainId === currentChainId
    );

    const VRFCoordinator = chainlinkVRFCoordinatorContracts.find(
      (_) => _.chainId === currentChainId
    );

    if (lotteryFactory && metadata && subscriptionId && VRFCoordinator) {
      const { title, description, numTickets, ticketPrice, prize } = metadata;
      const tx = prepareContractCall({
        contract: getContractByChainAndAddress(
          currentChainId,
          lotteryFactory.address
        ),
        method:
          "function createLottery(string memory _title, string memory _description, uint _numTickets, uint _dateInSeconds, uint _ticketPrice, address _vrfCoordinator, uint _subscriptionId, bytes32 _keyHash) external payable",
        params: [
          title,
          description,
          BigInt(numTickets),
          BigInt(60 * 10),
          toWei(`${ticketPrice}`),
          VRFCoordinator.address,
          subscriptionId,
          VRFCoordinator.keyHash,
        ],
        value: toWei(`${prize}`),
      });

      mutate(tx);
    }
  };

  console.log(`data`, data);

  return (
    <div>
      <div>Your lottery inputs:</div>
      <div>
        <button
          className="p-2 bg-blue-100 rounded-md"
          onClick={onCreateLottery}
        >
          Create Lottery
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
          </div>
        )}
        {isError && <div className="text-sm text-red-700">{error.message}</div>}
      </div>
    </div>
  );
};
