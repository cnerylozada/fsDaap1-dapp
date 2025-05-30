"use client";
import { useCheckWalletAndNetwork } from "@/components/hooks";
import { getContractByChainAndAddress } from "@/contracts/client";
import { useParams } from "next/navigation";
import { Hex, prepareContractCall } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { getProofByCustomers } from "./utils";
import Link from "next/link";
import { appScanURLRecord } from "@/contracts/settings";
import { shortenHex } from "thirdweb/utils";
import { useEffect, useState } from "react";
import { getFormattedSendingFee } from "@/server/cross-minting";

export const CrossClaimTicket = ({
  customers,
}: {
  customers: readonly (readonly [string, bigint])[];
}) => {
  const { networkName, address } = useParams();

  const {
    isWalletConnectedToCorrectChain,
    targetAppNetwork,
    appChainId,
    walletAddress,
  } = useCheckWalletAndNetwork(`${networkName}`);

  const [sendingFee, setSendingFee] = useState(0);
  const getSendingFee = async (walletAddress: string) => {
    const proof = getProofByCustomers(customers, walletAddress, appChainId);
    const fee = await getFormattedSendingFee(
      appChainId,
      `${address}`,
      proof,
      walletAddress
    );
    return fee;
  };

  const { mutate, data, isPending, isSuccess, isError, error, reset } =
    useSendAndConfirmTransaction();

  const onClaimNFT = async () => {
    if (walletAddress) {
      const proof = getProofByCustomers(customers, walletAddress, appChainId);

      reset();
      const transaction = prepareContractCall({
        contract: getContractByChainAndAddress(appChainId, `${address}`),
        method:
          "function sendMessage(bytes32[] memory _proof, (address,uint256) memory _user) external",
        params: [proof as Hex[], [walletAddress, BigInt(appChainId)]],
      });
      mutate(transaction);
    }
  };

  useEffect(() => {
    if (walletAddress)
      getSendingFee(walletAddress).then((_) => setSendingFee(_));
  }, [walletAddress]);

  if (!walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  return (
    <div>
      <div>CrossClaimTicket</div>

      <div className="mb-3">Sending Fee: {sendingFee} LINK</div>

      <div>
        <button
          className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
          onClick={onClaimNFT}
          disabled={isPending}
        >
          Claim NFT
        </button>
      </div>
      {isPending && <div>Loading transaction ...</div>}
      {isSuccess && (
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
      )}
      {isError && <div className="text-sm text-red-700">{error.message}</div>}
    </div>
  );
};
