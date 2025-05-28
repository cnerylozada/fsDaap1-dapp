import { getAppChainIdByPath } from "@/components/utils/contracts";
import { getContractByChainAndAddress } from "@/contracts/client";
import { appScanURLRecord } from "@/contracts/settings";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { prepareContractCall } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { shortenHex } from "thirdweb/utils";

export const Withdraw = ({
  owner,
  walletAddress,
}: {
  owner: string;
  walletAddress?: string;
}) => {
  const { address, networkName } = useParams();
  const appChainId = getAppChainIdByPath(`${networkName}`);

  const isOwner = owner === walletAddress;

  const { mutateAsync, data, isPending, isSuccess, error, reset } =
    useSendAndConfirmTransaction();

  const router = useRouter();
  const onWithdraw = async () => {
    reset();
    const transaction = prepareContractCall({
      contract: getContractByChainAndAddress(appChainId, `${address}`),
      method: "function withdraw() external",
      params: [],
    });
    await mutateAsync(transaction);
    router.refresh();
  };

  return (
    <div>
      <div className="font-bold">Withdraw</div>
      <div>
        {isOwner
          ? "You are the owner"
          : "You are not able to perform this operation"}
      </div>
      {isOwner && (
        <div>
          <button
            className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer disabled:cursor-not-allowed"
            onClick={onWithdraw}
            disabled={isPending}
          >
            Withdraw funds
          </button>
        </div>
      )}

      <div>
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
        {error && (
          <div className="mt-1 text-red-700 text-sm">{error.message}</div>
        )}
      </div>
    </div>
  );
};
