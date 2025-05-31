"use client";
import { useCheckWalletAndNetwork } from "@/components/hooks";
import { getNFTTokenList } from "@/server/cross-minting";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const GetTokenId = () => {
  const { networkName, address } = useParams();

  const {
    isWalletConnectedToCorrectChain,
    targetAppNetwork,
    appChainId,
    walletAddress,
  } = useCheckWalletAndNetwork(`${networkName}`);

  const [tokenList, setTokenList] = useState<bigint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTokenList = async (walletAddress: string) => {
    setIsLoading(true);
    const tokenList = await getNFTTokenList(
      appChainId,
      `${address}`,
      walletAddress
    );
    setTokenList(tokenList);
    setIsLoading(false);
  };

  useEffect(() => {
    if (walletAddress && isWalletConnectedToCorrectChain)
      fetchTokenList(walletAddress);
  }, [walletAddress, isWalletConnectedToCorrectChain]);

  if (!walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  return (
    <div>
      <div className="font-bold">Your token list:</div>
      <div>
        If you already claimed your NFT and want to import it in your wallet
        then you need the NFT address:{" "}
        <span className="text-xs md:text-base">{address}</span>
      </div>
      <div>You need also a token id:</div>
      {isLoading && <div>Loading...</div>}
      {!isLoading && tokenList.length ? (
        tokenList.map((_, index) => (
          <div key={index}>
            #{index + 1} Token id: {_.toString()}
          </div>
        ))
      ) : (
        <div>There are no tokens</div>
      )}
    </div>
  );
};
