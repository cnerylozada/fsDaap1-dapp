import { getContractByChainAndAddress } from "@/contracts/client";
import { appScanURLRecord, IAppContract } from "@/contracts/settings";
import Link from "next/link";
import { Hex, prepareContractCall } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { shortenHex } from "thirdweb/utils";
import { getMerkleTree } from "../../[address]/_components/utils";

export const EnterCustomers = ({
  factoryContract,
}: {
  factoryContract: IAppContract;
}) => {
  const { mutate, isPending, isSuccess, isError, error, data } =
    useSendAndConfirmTransaction();

  const onSubmit = () => {
    const whiteList: { walletAddress: string; chainId: number }[] = [
      {
        walletAddress: "0x54e8dc4C949eEFAdb78DB60F3feCe3A47FcBFDa1",
        chainId: 11155420,
      },
      {
        walletAddress: "0x3d4670AE7C08e5812F616E16bCf14b79a25F6F53",
        chainId: 11155420,
      },
    ];
    const formatWhiteList = whiteList.map(
      (_) => [_.walletAddress, BigInt(_.chainId)] as const
    );
    const merkleRoot = getMerkleTree(formatWhiteList).getHexRoot();
    const transaction = prepareContractCall({
      contract: getContractByChainAndAddress(
        factoryContract.chainId,
        factoryContract.address
      ),
      method:
        "function createWhiteList((address,uint256)[] memory _users, bytes32 _merkleRoot) external",
      params: [formatWhiteList, merkleRoot as Hex],
    });
    mutate(transaction);
  };
  return (
    <div>
      <div>
        <button onClick={onSubmit}>Submit</button>
      </div>

      {isPending && <div>Loading transaction ...</div>}
      {isSuccess && (
        <div>
          Check your transaction:{" "}
          <Link
            href={`${appScanURLRecord[factoryContract.chainId]}/${
              data.transactionHash
            }`}
            target="_blank"
            className="text-blue-700 text-sm underline"
          >
            Transaction Hash: {shortenHex(data.transactionHash)}
          </Link>
        </div>
      )}
      {isError && <div>{error.message}</div>}
    </div>
  );
};
