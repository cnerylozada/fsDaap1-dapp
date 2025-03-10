import { getServerSideContractByChainAndAddress } from "@/contracts/server";
import { readContract, toEther } from "thirdweb";
import { ChainOptions } from "thirdweb/chains";
import { AddFundsForm } from "./AddFundsForm";

export const FundMe = async ({
  currentChain,
  address,
}: {
  currentChain: Readonly<
    ChainOptions & {
      rpc: string;
    }
  >;
  address: string;
}) => {
  const [currentBalance, minAmountInUSD] = await Promise.all([
    readContract({
      contract: getServerSideContractByChainAndAddress(currentChain, address),
      method: "function getBalance() external view returns (uint)",
      params: [],
    }),
    readContract({
      contract: getServerSideContractByChainAndAddress(currentChain, address),
      method: "function getMinAmountInUSD() external view returns (uint)",
      params: [],
    }),
  ]);

  return (
    <div>
      <div className="mb-4">
        <div>CrowdFunding</div>
        <div>getBalance: {toEther(currentBalance)} ETH</div>
        <div>getMinAmountInUSD: USD$ {minAmountInUSD.toString()}</div>
      </div>

      <AddFundsForm />
    </div>
  );
};
