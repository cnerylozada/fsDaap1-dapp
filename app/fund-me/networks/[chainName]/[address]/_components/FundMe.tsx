import { getServerSideContractByChainAndAddress } from "@/contracts/server";
import { readContract } from "thirdweb";
import { ChainOptions } from "thirdweb/chains";

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
  const minAmountInUSD = await readContract({
    contract: getServerSideContractByChainAndAddress(currentChain, address),
    method: "function getMinAmountInUSD() external view returns (uint)",
    params: [],
  });

  return (
    <div>
      <div>CrowdFunding</div>
      <div>getMinAmountInUSD: USD$ {minAmountInUSD.toString()}</div>
    </div>
  );
};
