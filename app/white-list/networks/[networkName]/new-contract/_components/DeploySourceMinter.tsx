import { AppChainId, appNetworkRecord } from "@/contracts/settings";
import { thirdwebClientSide } from "@/lib/thirdweb/client";
import {
  useActiveWalletChain,
  useNetworkSwitcherModal,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { IManageCreation, Steps } from "./CreationFlow";
import {
  Hex,
  parseEventLogs,
  prepareContractCall,
  prepareEvent,
} from "thirdweb";
import { getContractByChainAndAddress } from "@/contracts/client";
import { sourceMinterFactoryContract } from "@/contracts/contracts";
import { Dispatch, SetStateAction } from "react";
import { TransactionReceipt } from "thirdweb/transaction";

const getSourceMinterContractAddress = (txReceipt: TransactionReceipt) => {
  const newSourceMinter = prepareEvent({
    signature: "event NewSourceMinter(address indexed sourceMinterAddress)",
  });
  const createSourceMinterLogs = parseEventLogs({
    events: [newSourceMinter],
    logs: txReceipt.logs,
  });

  const { args } = createSourceMinterLogs[0];
  const { sourceMinterAddress } = args;
  return sourceMinterAddress;
};

export const DeploySourceMinter = ({
  manageCreation,
  setManageCreation,
}: {
  manageCreation: IManageCreation;
  setManageCreation: Dispatch<SetStateAction<IManageCreation>>;
}) => {
  const activeWalletChain = useActiveWalletChain();
  const networkSwitcher = useNetworkSwitcherModal();

  const { mutate, isPending, isSuccess, data, isError, error } =
    useSendAndConfirmTransaction();

  const onCreateSourceMinter = async () => {
    if (
      activeWalletChain &&
      manageCreation.destinyContractAddress &&
      manageCreation.merkleRoot
    ) {
      const transaction = prepareContractCall({
        contract: getContractByChainAndAddress(
          sourceMinterFactoryContract.chainId,
          sourceMinterFactoryContract.address
        ),
        method:
          "function createSourceMinter(address _opSepoliaDestinyAddress, bytes32 _merkleRoot) external",
        params: [
          manageCreation.destinyContractAddress,
          manageCreation.merkleRoot as Hex,
        ],
      });
      mutate(transaction);
    }
  };

  const opSepoliaMetadata = appNetworkRecord[AppChainId.optimismSepolia];
  const arbitrumSepoliaMedatada = appNetworkRecord[AppChainId.arbitrumSepolia];

  return (
    <div>
      <div className="mb-3">
        <div>
          Maybe some members of your audience are not in{" "}
          {opSepoliaMetadata?.name}, but they can still claim their NFT from{" "}
          {arbitrumSepoliaMedatada?.name}
        </div>
        <div>
          Then after some minutes they will receive a NFT in{" "}
          {opSepoliaMetadata?.name} using the power of cross-chain!
        </div>
      </div>
      <div className="mb-3 font-bold">
        Current network: {activeWalletChain?.name}
      </div>

      {activeWalletChain &&
        activeWalletChain.id !== AppChainId.arbitrumSepolia && (
          <button
            className="p-2 bg-orange-100 rounded-md disabled:bg-gray-200 cursor-pointer"
            onClick={async () => {
              await networkSwitcher.open({
                client: thirdwebClientSide,
                sections: [
                  {
                    label: "To continue change to",
                    chains: [arbitrumSepoliaMedatada],
                  },
                ],
              });
            }}
          >
            Switch to {arbitrumSepoliaMedatada?.name}
          </button>
        )}

      <div>
        {activeWalletChain &&
          activeWalletChain.id === AppChainId.arbitrumSepolia && (
            <>
              {isSuccess && data ? (
                <button
                  className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    const sourceMinter = getSourceMinterContractAddress(data);

                    setManageCreation((_) => ({
                      ..._,
                      currentStep: Steps.SET_SOURCE_MINTER,
                      sourceContractAddress: sourceMinter,
                    }));
                  }}
                >
                  Continue
                </button>
              ) : (
                <>
                  <div className="mb-3">
                    Lets create a new contract that users from{" "}
                    {arbitrumSepoliaMedatada?.name} will use
                  </div>
                  <div>
                    <button
                      className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
                      onClick={onCreateSourceMinter}
                      disabled={isPending}
                    >
                      Create source minter
                    </button>
                  </div>
                  {isPending && <div>Loading transaction ...</div>}
                  {isError && (
                    <div className="text-sm text-red-700">{error.message}</div>
                  )}
                </>
              )}
            </>
          )}
      </div>
    </div>
  );
};
