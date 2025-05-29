"use client";
import { getAppChainIdByPath } from "@/components/utils/contracts";
import { useParams } from "next/navigation";
import {
  useActiveAccount,
  useActiveWalletChain,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { Hex, prepareContractCall } from "thirdweb";
import { getContractByChainAndAddress } from "@/contracts/client";
import { getProofByCustomers } from "./utils";
import Link from "next/link";
import { appScanURLRecord } from "@/contracts/settings";
import { shortenHex } from "thirdweb/utils";

export const ClaimTicket = ({
  customers,
}: {
  customers: readonly (readonly [string, bigint])[];
}) => {
  const { networkName, address } = useParams();
  const activeAccount = useActiveAccount();
  const activeWalletChain = useActiveWalletChain();
  const appChainId = getAppChainIdByPath(`${networkName}`);

  const { mutate, data, isPending, isSuccess, isError, reset } =
    useSendAndConfirmTransaction();

  const onClaimNFT = async () => {
    if (activeAccount && activeWalletChain) {
      const proof = getProofByCustomers(
        customers,
        activeAccount.address,
        activeWalletChain.id
      );

      reset();
      const transaction = prepareContractCall({
        contract: getContractByChainAndAddress(appChainId, `${address}`),
        method:
          "function claimNFT(bytes32[] memory _proof, (address,uint256) memory _user) external",
        params: [
          proof as Hex[],
          [activeAccount.address, BigInt(activeWalletChain.id)],
        ],
      });
      mutate(transaction);
    }
  };

  return (
    <div>
      <div>
        <button
          className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200"
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
