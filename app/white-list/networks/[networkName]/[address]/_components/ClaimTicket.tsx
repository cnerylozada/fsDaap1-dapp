"use client";
import { useParams } from "next/navigation";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { Hex, prepareContractCall } from "thirdweb";
import { getContractByChainAndAddress } from "@/contracts/client";
import { getProofByCustomers } from "./utils";
import Link from "next/link";
import { appScanURLRecord } from "@/contracts/settings";
import { shortenHex } from "thirdweb/utils";
import { useCheckWalletAndNetwork } from "@/components/hooks";

export const ClaimTicket = ({
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

  const { mutate, data, isPending, isSuccess, isError, reset } =
    useSendAndConfirmTransaction();

  const onClaimNFT = async () => {
    if (walletAddress) {
      const proof = getProofByCustomers(customers, walletAddress, appChainId);

      reset();
      const transaction = prepareContractCall({
        contract: getContractByChainAndAddress(appChainId, `${address}`),
        method:
          "function claimNFT(bytes32[] memory _proof, (address,uint256) memory _user) external",
        params: [proof as Hex[], [walletAddress, BigInt(appChainId)]],
      });
      mutate(transaction);
    }
  };

  if (!walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  return (
    <div>
      <div className="mb-3 font-bold">
        If you are on the white-list, then you will be able to claim just 1 NFT!
      </div>
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
          <div>Enjoy your new NFT in your wallet!</div>
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
      {isError && (
        <div className="text-sm text-red-700">
          Somethig went wrong. Maybe you already claimed a NFT or you are not
          able to claim a NFT
        </div>
      )}
    </div>
  );
};
