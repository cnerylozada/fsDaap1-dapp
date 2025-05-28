"use client";

import { useCheckWalletAndNetwork } from "@/components/hooks";
import { AddFundsForm } from "./AddFundsForm";
import { useParams } from "next/navigation";
import { Withdraw } from "./Withdraw";

export const ManageFunds = ({
  owner,
  minAmountInUSD,
  priceFeed,
}: {
  owner: string;
  minAmountInUSD: number;
  priceFeed: number;
}) => {
  const { networkName } = useParams();

  const { isWalletConnectedToCorrectChain, targetAppNetwork, walletAddress } =
    useCheckWalletAndNetwork(`${networkName}`);

  if (!walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  return (
    <div className="space-y-4">
      <Withdraw owner={owner} walletAddress={walletAddress} />

      <AddFundsForm
        minAmountInUSD={+minAmountInUSD.toString()}
        priceFeed={+priceFeed.toString()}
      />
    </div>
  );
};
