import { getContractByChainAndAddress } from "@/contracts/client";
import { AppChainId, IAppContract } from "@/contracts/settings";
import {
  Hex,
  parseEventLogs,
  prepareContractCall,
  prepareEvent,
} from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { getMerkleTree } from "../../[address]/_components/utils";
import { Dispatch, SetStateAction } from "react";
import { IManageCreation, Steps } from "./CreationFlow";
import { TransactionReceipt } from "thirdweb/transaction";
import { useCheckWalletAndNetwork } from "@/components/hooks";
import { useParams } from "next/navigation";

const getDestinyMinterContractAddress = (txReceipt: TransactionReceipt) => {
  const newDestinyMinter = prepareEvent({
    signature:
      "event NewDestinyMinter(address indexed destinyMinter, bytes32 merkleRoot)",
  });
  const createWhiteListLogs = parseEventLogs({
    events: [newDestinyMinter],
    logs: txReceipt.logs,
  });
  const { args } = createWhiteListLogs[0];
  return args;
};

export const EnterCustomers = ({
  factoryContract,
  setManageCreation,
}: {
  factoryContract: IAppContract;
  setManageCreation: Dispatch<SetStateAction<IManageCreation>>;
}) => {
  const { mutate, isPending, isSuccess, isError, error, data } =
    useSendAndConfirmTransaction();

  const onSubmit = () => {
    const whiteList: { walletAddress: string; chainId: number }[] = [
      {
        walletAddress: "0x54e8dc4C949eEFAdb78DB60F3feCe3A47FcBFDa1",
        chainId: AppChainId.optimismSepolia,
      },
      {
        walletAddress: "0x3d4670AE7C08e5812F616E16bCf14b79a25F6F53",
        chainId: AppChainId.arbitrumSepolia,
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

  const { networkName } = useParams();
  const { isWalletConnectedToCorrectChain, targetAppNetwork } =
    useCheckWalletAndNetwork(`${networkName}`);

  if (!isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );
  return (
    <div>
      {isSuccess && data ? (
        <div>
          <button
            className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
            onClick={() => {
              const { destinyMinter, merkleRoot } =
                getDestinyMinterContractAddress(data);
              setManageCreation((_) => ({
                ..._,
                currentStep: Steps.DEPLOY_SOURCE_MINTER,
                destinyContractAddress: destinyMinter,
                merkleRoot,
              }));
            }}
          >
            Continue
          </button>
        </div>
      ) : (
        <>
          <div className="mb-3">
            First, lets enter the data of your audience. After the final step,
            only they will be able to claim only 1 NFT stored{" "}
            {targetAppNetwork?.name}
          </div>

          <div>
            <button
              className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
              onClick={onSubmit}
              disabled={isPending}
            >
              Submit my audience
            </button>
          </div>
          {isPending && <div>Loading transaction ...</div>}
          {isError && (
            <div className="text-sm text-red-700">{error.message}</div>
          )}
        </>
      )}
    </div>
  );
};
