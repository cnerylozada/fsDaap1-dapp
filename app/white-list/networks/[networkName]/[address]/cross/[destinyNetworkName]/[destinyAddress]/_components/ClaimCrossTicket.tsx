import { AppChainId, appScanURLRecord } from "@/contracts/settings";
import Link from "next/link";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { shortenHex } from "thirdweb/utils";
import { getContractByChainAndAddress } from "@/contracts/client";
import {
  Hex,
  parseEventLogs,
  prepareContractCall,
  prepareEvent,
} from "thirdweb";
import { TransactionReceipt } from "thirdweb/transaction";

const getMessageId = (txReceipt: TransactionReceipt) => {
  const messageSentEvent = prepareEvent({
    signature:
      "event MessageSent(bytes32 indexed messageId, uint64 indexed destinationChainSelector, address receiver, address feeToken, uint256 fees)",
  });
  const sendMessageLogs = parseEventLogs({
    events: [messageSentEvent],
    logs: txReceipt.logs,
  });
  const { args } = sendMessageLogs[0];
  const { messageId } = args;
  return messageId;
};

export const ClaimCrossTicket = ({
  walletAddress,
  appChainId,
  proof,
  sourceMinterContractAddress,
}: {
  walletAddress: string;
  appChainId: AppChainId;
  proof: string[];
  sourceMinterContractAddress: string;
}) => {
  const { mutate, data, isPending, isSuccess, isError, error, reset } =
    useSendAndConfirmTransaction();

  const onCrossClaimNFT = async () => {
    reset();
    const transaction = prepareContractCall({
      contract: getContractByChainAndAddress(
        appChainId,
        sourceMinterContractAddress
      ),
      method:
        "function sendMessage(bytes32[] memory _proof, (address,uint256) memory _user) external",
      params: [proof as Hex[], [walletAddress, BigInt(appChainId)]],
    });
    mutate(transaction);
  };
  return (
    <div>
      <div>
        <button
          className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
          onClick={onCrossClaimNFT}
          disabled={isPending}
        >
          Claim Cross Ticket
        </button>
      </div>

      {isPending && <div>Loading transaction ...</div>}
      {isSuccess && (
        <div>
          <div>
            Check your transaction:{" "}
            <Link
              href={`${appScanURLRecord[appChainId]}/${data.transactionHash}`}
              target="_blank"
              className="text-blue-700 text-sm underline"
            >
              Transaction Hash: {shortenHex(data.transactionHash)}
            </Link>
          </div>
          <div>
            Check your transaction:{" "}
            <Link
              href={`https://ccip.chain.link/#/side-drawer/msg/${getMessageId(
                data
              )}`}
              target="_blank"
              className="text-blue-700 text-sm underline"
            >
              Track your cross transaction!
            </Link>
          </div>
        </div>
      )}
      {isError && <div className="text-sm text-red-700">{error.message}</div>}
    </div>
  );
};
