import { AppChainId } from "@/contracts/settings";
import { Dispatch, SetStateAction } from "react";
import { IManageCreation, Steps } from "./LotteryCreationFlow";
import { lotteryFactoryContracts } from "@/contracts/contracts";
import { chainlinkVRFCoordinatorContracts } from "@/contracts/chainlink";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import {
  parseEventLogs,
  prepareContractCall,
  prepareEvent,
  toWei,
} from "thirdweb";
import { getContractByChainAndAddress } from "@/contracts/client";
import { TransactionReceipt } from "thirdweb/transaction";

const getLotteryContractAddress = (txReceipt: TransactionReceipt) => {
  const newLotteryEvent = prepareEvent({
    signature:
      "event NewLottery(address indexed _address, uint _createdAt, (string,string,address,uint256,uint256,uint256,uint256) _detail)",
  });
  const createLotteryLogs = parseEventLogs({
    events: [newLotteryEvent],
    logs: txReceipt.logs,
  });
  const { args } = createLotteryLogs[0];
  const { _address } = args;
  return _address;
};

const AddConsumer = ({
  currentChainId,
  subscriptionId,
  setManageCreation,
  lotteryContractAddress,
}: {
  currentChainId: AppChainId;
  subscriptionId: bigint;
  setManageCreation: Dispatch<SetStateAction<IManageCreation>>;
  lotteryContractAddress: string;
}) => {
  const { data, mutate, isPending, isSuccess, isError, error } =
    useSendAndConfirmTransaction();

  const addConsumerToSubscription = async () => {
    const VRFCoordinator = chainlinkVRFCoordinatorContracts.find(
      (_) => _.chainId === currentChainId
    );
    if (VRFCoordinator && subscriptionId) {
      const tx = prepareContractCall({
        contract: getContractByChainAndAddress(
          currentChainId,
          VRFCoordinator.address
        ),
        method:
          "function addConsumer(uint256 subId, address consumer) external",
        params: [subscriptionId, lotteryContractAddress],
      });
      mutate(tx);
    }
  };

  return (
    <div>
      {!data && (
        <div>
          <button
            className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200"
            onClick={() => addConsumerToSubscription()}
            disabled={isPending}
          >
            Connect Lottery with Subscription
          </button>
        </div>
      )}
      {isPending && <div>Adding lottery to subscription ...</div>}
      {isSuccess && data && (
        <div>
          <button
            className="p-2 bg-blue-100 rounded-md"
            onClick={() => {
              setManageCreation((_) => ({
                ..._,
                currentStep: Steps.CONFIG_AUTOMATION,
                lotteryContractAddress,
              }));
            }}
          >
            Config Automation
          </button>
        </div>
      )}
      {isError && <div className="text-sm text-red-700">{error.message}</div>}
    </div>
  );
};

export const ConnectNewLotteryWithSubscription = ({
  currentChainId,
  manageCreation,
  setManageCreation,
}: {
  currentChainId: AppChainId;
  manageCreation: IManageCreation;
  setManageCreation: Dispatch<SetStateAction<IManageCreation>>;
}) => {
  const { metadata, subscriptionId } = manageCreation;

  const { data, mutate, isPending, isSuccess, isError, error } =
    useSendAndConfirmTransaction();

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

  return (
    <div>
      <div>Your lottery inputs:</div>
      <div></div>

      {subscriptionId && isSuccess && data ? (
        <AddConsumer
          currentChainId={currentChainId}
          subscriptionId={subscriptionId}
          lotteryContractAddress={getLotteryContractAddress(data)}
          setManageCreation={setManageCreation}
        />
      ) : (
        <>
          <div>
            <button
              className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200"
              onClick={onCreateLottery}
              disabled={isPending}
            >
              Create Lottery without automation
            </button>
          </div>

          <div>
            {isPending && <div>Creating lottery without automation ...</div>}
            {isError && (
              <div className="text-sm text-red-700">{error.message}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
