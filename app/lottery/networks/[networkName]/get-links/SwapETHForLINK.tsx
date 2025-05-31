"use client";
import { useCheckWalletAndNetwork } from "@/components/hooks";
import { formatToken } from "@/components/utils/contracts";
import { LINKTokenContracts } from "@/contracts/chainlink";
import { getContractByChainAndAddress } from "@/contracts/client";
import { basicUniswapV2Contracts } from "@/contracts/contracts";
import { AppChainId, appScanURLRecord } from "@/contracts/settings";
import { getTokensBalance } from "@/server/commons";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { prepareContractCall, toWei } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { shortenHex } from "thirdweb/utils";

const MINIMUM_EH_TO_CHANGE = toWei("0.00055");

const BasicSwap = ({ currentChainId }: { currentChainId: AppChainId }) => {
  const { mutate, isPending, isSuccess, isError, error, data } =
    useSendAndConfirmTransaction();

  const onSwap = () => {
    const appContract = basicUniswapV2Contracts.filter(
      (_) => _.chainId === currentChainId
    )[0];
    const tx = prepareContractCall({
      contract: getContractByChainAndAddress(
        currentChainId,
        appContract.address
      ),
      method:
        "function swapETHForLINK() external payable returns (uint256 amountOut)",
      params: [],
      value: MINIMUM_EH_TO_CHANGE,
    });
    mutate(tx);
  };

  return (
    <div className="mt-4">
      <div>
        <button
          onClick={onSwap}
          disabled={isPending}
          className="p-2 bg-blue-100 rounded-md cursor-pointer disabled:bg-gray-200"
        >
          Get Aprox. +1 LINK
        </button>
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

export const SwapETHForLINK = ({
  currentChainId,
}: {
  currentChainId: AppChainId;
}) => {
  const { networkName } = useParams();

  const { isWalletConnectedToCorrectChain, targetAppNetwork, walletAddress } =
    useCheckWalletAndNetwork(`${networkName}`);
  const [tokenList, setTokenList] = useState<
    | { name: string; balance: string; symbol: string; rawBalance: bigint }[]
    | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTokens = async (walletAddress: string) => {
    const LINKToken = LINKTokenContracts.find(
      (_) => _.chainId === currentChainId
    );

    setIsLoading(true);
    if (LINKToken) {
      const tokens = await getTokensBalance(walletAddress, currentChainId, [
        "",
        LINKToken.address,
      ]);
      setTokenList(
        tokens.map((_) => ({
          name: _.name,
          balance: formatToken(_.value, _.decimals),
          symbol: _.symbol,
          rawBalance: _.value,
        }))
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (walletAddress) fetchTokens(walletAddress);
  }, [walletAddress]);

  if (!isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  return (
    <div>
      {isLoading && <div>Loading ...</div>}
      {tokenList?.length && (
        <div>
          <div className="font-bold">Your tokens</div>
          <div>
            {tokenList.map((_) => (
              <div key={_.name}>
                <span className="font-bold">Token:</span> {_.name}{" "}
                <span className="font-bold">Balance:</span> {_.balance}{" "}
                {_.symbol}
              </div>
            ))}
          </div>
        </div>
      )}

      {tokenList?.length &&
        tokenList.filter((_) => _.symbol === "ETH")[0].rawBalance >
          MINIMUM_EH_TO_CHANGE && <BasicSwap currentChainId={currentChainId} />}
    </div>
  );
};
