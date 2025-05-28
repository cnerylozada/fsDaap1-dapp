import { readContract, toEther } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";
import { AppChainId } from "@/contracts/settings";
import { getContractByChainAndAddress } from "@/contracts/server";
import { ManageFunds } from "./ManageFunds";

export const FundMe = async ({
  currentChainId,
  address,
}: {
  currentChainId: AppChainId;
  address: string;
}) => {
  const fundMeContract = getContractByChainAndAddress(currentChainId, address);

  const [owner, currentBalance, minAmountInUSD, funders, priceFeed] =
    await Promise.all([
      readContract({
        contract: fundMeContract,
        method: "function getOwner() external view returns (address)",
        params: [],
      }),
      readContract({
        contract: fundMeContract,
        method: "function getBalance() external view returns (uint)",
        params: [],
      }),
      readContract({
        contract: fundMeContract,
        method: "function getMinAmountInUSD() external view returns (uint)",
        params: [],
      }),
      readContract({
        contract: fundMeContract,
        method:
          "function getFunders() external view returns ((address, uint, uint, bool)[] memory)",
        params: [],
      }),
      readContract({
        contract: fundMeContract,
        method: "function getPriceFeed() external view returns (uint)",
        params: [],
      }),
    ]);

  return (
    <div>
      <div className="mb-4 block border rounded-md p-3">
        <div className="font-bold">Owner: {shortenAddress(owner)}</div>
        <div className="flex gap-x-5">
          <div>Balance: {toEther(currentBalance)} ETH</div>
          <div>Min: USD$ {minAmountInUSD.toString()}</div>
          <div>1ETH = USD$ {priceFeed.toString()}</div>
        </div>
        <div>
          <div className="font-bold">Funders:</div>
          {funders.length ? (
            funders.map((_, index) => {
              return (
                <div key={index}>
                  <div className="flex gap-x-5">
                    <div>Wallet: {shortenAddress(_[0])}</div>
                    <div>Amount: {toEther(_[1])} ETH</div>
                  </div>
                  <div className="text-xs">{_[3] && "Withdrawn"}</div>
                </div>
              );
            })
          ) : (
            <div>There are no funders yet</div>
          )}
        </div>
      </div>

      <ManageFunds
        owner={owner}
        minAmountInUSD={+minAmountInUSD.toString()}
        priceFeed={+priceFeed.toString()}
      />
    </div>
  );
};
