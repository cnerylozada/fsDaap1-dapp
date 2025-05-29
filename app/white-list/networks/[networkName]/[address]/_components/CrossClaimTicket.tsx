"use client";
import { useCheckWalletAndNetwork } from "@/components/hooks";
import { getContractByChainAndAddress } from "@/contracts/client";
import { useParams } from "next/navigation";
import { Hex, prepareContractCall } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { getProofByCustomers } from "./utils";

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

  const { mutate, data, isPending, isSuccess, isError, reset } =
    useSendAndConfirmTransaction();

  const onClaimNFT = async () => {
    if (walletAddress) {
      const proof = getProofByCustomers(customers, walletAddress, appChainId);

      const transaction = prepareContractCall({
        contract: getContractByChainAndAddress(appChainId, `${address}`),
        method:
          "function sendMessage(bytes32[] memory _proof, (address,uint256) memory _user) external",
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
      <div>CrossClaimTicket</div>

      <div>
        <button
          className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
          onClick={onClaimNFT}
          disabled={isPending}
        >
          Claim NFT
        </button>
      </div>
    </div>
  );
};
