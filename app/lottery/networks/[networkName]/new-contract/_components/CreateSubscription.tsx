import { getContractByChainAndAddress } from "@/contracts/client";
import { AppChainId } from "@/contracts/settings";
import {
  parseEventLogs,
  prepareContractCall,
  prepareEvent,
  toEther,
} from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { encodeAbiParameters } from "thirdweb/utils";
import {
  chainlinkVRFCoordinatorContracts,
  LINKTokenContracts,
} from "@/contracts/chainlink";
import { Dispatch, SetStateAction } from "react";
import { IManageCreation, Steps } from "./LotteryCreationFlow";
import { TransactionReceipt } from "thirdweb/transaction";
import { LotteryData } from "./LotteryData";
import { AMOUNT_TO_FUND_VRF_COORDINATOR } from "./utils";

const getSubscriptionId = (txReceipt: TransactionReceipt) => {
  const newSubscriptionEvent = prepareEvent({
    signature:
      "event SubscriptionCreated(uint256 indexed subId, address owner)",
  });
  const createSubscriptionLogs = parseEventLogs({
    events: [newSubscriptionEvent],
    logs: txReceipt.logs,
  });
  const { args } = createSubscriptionLogs[0];
  const { subId } = args;
  return subId;
};

const AddFundsToSubscription = ({
  subscriptionId,
  currentChainId,
  setManageCreation,
}: {
  subscriptionId: bigint;
  currentChainId: AppChainId;
  setManageCreation: Dispatch<SetStateAction<IManageCreation>>;
}) => {
  const { mutate, data, isError, error, isSuccess, isPending } =
    useSendAndConfirmTransaction();

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
        params: [
          VRFCoodinator.address,
          AMOUNT_TO_FUND_VRF_COORDINATOR,
          encodeSubId,
        ],
      });
      mutate(tx);
    }
  };

  return (
    <div>
      {!data && (
        <div>
          <div>
            The randomness process costs some money, so send them to your
            subscription
          </div>
          <button
            className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
            onClick={() => onFundSubscription(subscriptionId)}
            disabled={isPending}
          >
            Send {toEther(AMOUNT_TO_FUND_VRF_COORDINATOR)} LINK
          </button>
        </div>
      )}
      {isPending && <div>Sending funds...</div>}
      {isSuccess && data && (
        <div>
          <button
            className="p-2 bg-blue-100 rounded-md"
            onClick={() => {
              setManageCreation((_) => ({
                ..._,
                subscriptionId,
                currentStep: Steps.ADD_CONSUMER,
              }));
            }}
          >
            Continue
          </button>
        </div>
      )}
      {isError && <div className="text-sm text-red-700">{error.message}</div>}
    </div>
  );
};

export const CreateSubscription = ({
  currentChainId,
  manageCreation,
  setManageCreation,
}: {
  currentChainId: AppChainId;
  manageCreation: IManageCreation;
  setManageCreation: Dispatch<SetStateAction<IManageCreation>>;
}) => {
  const { metadata } = manageCreation;
  const { mutate, isPending, data, isSuccess, error, isError } =
    useSendAndConfirmTransaction();

  const onCreateSubscription = async () => {
    const VRFContract = chainlinkVRFCoordinatorContracts.find(
      (_) => _.chainId === currentChainId
    );
    if (VRFContract) {
      const tx = prepareContractCall({
        contract: getContractByChainAndAddress(
          VRFContract.chainId,
          VRFContract.address
        ),
        method:
          "function createSubscription() external returns (uint256 subId)",
        params: [],
      });
      mutate(tx);
    }
  };

  return (
    <div className="space-y-4">
      {metadata && (
        <LotteryData lotteryDataEntered={metadata} className="mb-4" />
      )}

      {isSuccess && data ? (
        <AddFundsToSubscription
          subscriptionId={getSubscriptionId(data)}
          currentChainId={currentChainId}
          setManageCreation={setManageCreation}
        />
      ) : (
        <>
          <div>
            <div>
              To perform randomness we need to create a chainlink subscription
            </div>
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
            {isPending && <div>Creating subscription ...</div>}
            {isError && (
              <div className="text-sm text-red-700">{error.message}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
