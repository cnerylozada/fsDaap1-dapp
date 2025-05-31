import {
  AppChainId,
  appNetworkPathRecord,
  appScanURLRecord,
} from "@/contracts/settings";
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
import { IManageClaiming } from "./CrossChainClaimingFlow";

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
  manageClaiming,
  walletAddress,
  currentChainId,
  sourceMinterContractAddress,
  destinyAddress,
}: {
  manageClaiming: IManageClaiming;
  walletAddress: string;
  currentChainId: AppChainId;
  sourceMinterContractAddress: string;
  destinyAddress: string;
}) => {
  const { mutate, data, isPending, isSuccess, isError, reset } =
    useSendAndConfirmTransaction();

  const onCrossClaimNFT = async () => {
    reset();
    if (manageClaiming.proof) {
      const transaction = prepareContractCall({
        contract: getContractByChainAndAddress(
          currentChainId,
          sourceMinterContractAddress
        ),
        method:
          "function sendMessage(bytes32[] memory _proof, (address,uint256) memory _user) external",
        params: [
          manageClaiming.proof as Hex[],
          [walletAddress, BigInt(currentChainId)],
        ],
      });
      mutate(transaction);
    }
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
              href={`${appScanURLRecord[currentChainId]}/${data.transactionHash}`}
              target="_blank"
              className="text-blue-700 text-sm underline"
            >
              Transaction Hash: {shortenHex(data.transactionHash)}
            </Link>
          </div>
          <div>
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
          <div>
            <div>
              It will take while before the NFT arrive in your wallet, to import
              it you will need the NFT address: {destinyAddress} and your
              tokenId. After the cross-chain transaction is done you can check
              your tokenId here
            </div>
            <Link
              href={`/white-list/networks/${appNetworkPathRecord[currentChainId]}/${destinyAddress}/token-id`}
              target="_blank"
            >
              Check my tokenId
            </Link>
          </div>
        </div>
      )}
      {isError && (
        <div className="text-sm text-red-700">
          Somethig went wrong. Maybe you already claimed a NFT or you are not
          able to claim a NFT
        </div>
      )}
    </div>
  );
};
