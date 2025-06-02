"use client";
import { useCheckWalletAndNetwork } from "@/components/hooks";
import { WalletTokensBalance } from "@/components/WalletTokensBalance";
import { getContractByChainAndAddress } from "@/contracts/client";
import { basicUniswapV2Contracts } from "@/contracts/contracts";
import { AppChainId, appScanURLRecord } from "@/contracts/settings";
import { getETHToLINKPriceFeed } from "@/server/lottery";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { prepareContractCall, toWei } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { shortenHex, toEther, toTokens } from "thirdweb/utils";
import { CHAINLINK_TOKEN_DECIMALS } from "../new-contract/_components/utils";

const MINIMUM_EH_TO_CHANGE = toWei("0.00055");

const BasicSwap = ({
  currentChainId,
  contractAddress,
}: {
  currentChainId: AppChainId;
  contractAddress: string;
}) => {
  const [ETHToLINK, setETHToLINK] = useState(BigInt(0));
  useEffect(() => {
    getETHToLINKPriceFeed(currentChainId, contractAddress).then((_) =>
      setETHToLINK(_)
    );
  }, []);

  const { mutate, isPending, isSuccess, isError, error, data } =
    useSendAndConfirmTransaction();
  const onSwap = () => {
    const tx = prepareContractCall({
      contract: getContractByChainAndAddress(currentChainId, contractAddress),
      method:
        "function swapETHForLINK() external payable returns (uint256 amountOut)",
      params: [],
      value: MINIMUM_EH_TO_CHANGE,
    });
    mutate(tx);
  };

  const TOKENS_TO_RECEIVE = toTokens(
    MINIMUM_EH_TO_CHANGE * ETHToLINK,
    CHAINLINK_TOKEN_DECIMALS
  );
  return (
    <div className="mt-4">
      <div>
        {ETHToLINK ? (
          <div>
            <div className="mb-2">
              1ETH === {ETHToLINK} LINK, so using{" "}
              {toEther(MINIMUM_EH_TO_CHANGE)} ETH, you will receive:{" "}
              {TOKENS_TO_RECEIVE} LINK
            </div>
            <button
              onClick={onSwap}
              disabled={isPending}
              className="p-2 bg-blue-100 rounded-md cursor-pointer disabled:bg-gray-200"
            >
              Get +{TOKENS_TO_RECEIVE} LINK
            </button>
          </div>
        ) : (
          <div>Loading fee ...</div>
        )}
      </div>

      {isPending && <div>Loading ...</div>}
      {isSuccess && data && (
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
        </div>
      )}
      {isError && <div className="text-sm text-red-700">{error.message}</div>}
    </div>
  );
};

export const SwapETHForLINK = ({}) => {
  const { networkName } = useParams();

  const {
    isWalletConnectedToCorrectChain,
    targetAppNetwork,
    walletAddress,
    activeAccount,
    appChainId,
  } = useCheckWalletAndNetwork(`${networkName}`);

  if (!activeAccount || !walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  const contractAddress = basicUniswapV2Contracts.find(
    (_) => _.chainId === appChainId
  );

  return (
    <div>
      <WalletTokensBalance
        activeAccount={activeAccount}
        currentChainId={appChainId}
      />
      {contractAddress && (
        <BasicSwap
          currentChainId={appChainId}
          contractAddress={contractAddress.address}
        />
      )}
    </div>
  );
};
