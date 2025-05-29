import {
  AppChainId,
  appNetworkRecord,
  IAppContract,
} from "@/contracts/settings";
import { thirdwebClientSide } from "@/lib/thirdweb/client";
import {
  useActiveWalletChain,
  useNetworkSwitcherModal,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { IManageCreation } from "./CreationFlow";
import { prepareContractCall } from "thirdweb";
import { getContractByChainAndAddress } from "@/contracts/client";
import Link from "next/link";

export const SetSourceMinter = ({
  manageCreation,
  factoryContract,
}: {
  manageCreation: IManageCreation;
  factoryContract: IAppContract;
}) => {
  const activeWalletChain = useActiveWalletChain();
  const networkSwitcher = useNetworkSwitcherModal();

  const { mutate, isPending, isSuccess, data, isError, error } =
    useSendAndConfirmTransaction();

  const onSetSourceMinter = async () => {
    if (
      activeWalletChain &&
      manageCreation.destinyContractAddress &&
      manageCreation.sourceContractAddress
    ) {
      const transaction = prepareContractCall({
        contract: getContractByChainAndAddress(
          factoryContract.chainId,
          factoryContract.address
        ),
        method:
          "function setSourceMinter(address _destinyMinter, address _arbitrumSourceMinter) external",
        params: [
          manageCreation.destinyContractAddress,
          manageCreation.sourceContractAddress,
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
        Finally lets connect your already {arbitrumSepoliaMedatada?.name}{" "}
        contract with another smart contract stored in {opSepoliaMetadata?.name}
      </div>

      <div className="mb-3 font-bold">
        Current network: {activeWalletChain?.name}
      </div>
      {activeWalletChain &&
        activeWalletChain.id !== AppChainId.optimismSepolia && (
          <button
            className="p-2 bg-orange-100 rounded-md disabled:bg-gray-200 cursor-pointer"
            onClick={async () => {
              await networkSwitcher.open({
                client: thirdwebClientSide,
                sections: [
                  {
                    label: "To continue change to",
                    chains: [opSepoliaMetadata],
                  },
                ],
              });
            }}
          >
            Swith to {opSepoliaMetadata?.name}
          </button>
        )}

      <div>
        {activeWalletChain &&
          activeWalletChain.id === AppChainId.optimismSepolia && (
            <>
              {isSuccess && data ? (
                <Link
                  href={"./"}
                  className="bg-green-100 p-2 rounded-md cursor-pointer"
                >
                  Kudos! Go back to audience list
                </Link>
              ) : (
                <>
                  <div>
                    <button
                      className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
                      onClick={onSetSourceMinter}
                      disabled={isPending}
                    >
                      Connect smart contracts
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
