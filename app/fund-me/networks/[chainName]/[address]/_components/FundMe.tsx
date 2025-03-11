import { getServerSideContractByChainAndAddress } from "@/contracts/server";
import {
  getContractEvents,
  prepareEvent,
  readContract,
  toEther,
} from "thirdweb";
import { ChainOptions } from "thirdweb/chains";
import { AddFundsForm } from "./AddFundsForm";
import { shortenAddress } from "thirdweb/utils";

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
  const newFunderEvent = prepareEvent({
    signature:
      "event NewFunder(address _address, uint _amount, uint _createdAt)",
  });
  const fundMeContract = getServerSideContractByChainAndAddress(
    currentChain,
    address
  );

  const [owner, currentBalance, minAmountInUSD, funders] = await Promise.all([
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
    getContractEvents({
      contract: fundMeContract,
      events: [newFunderEvent],
      fromBlock: "earliest",
      toBlock: "latest",
    }),
  ]);

  return (
    <div>
      <div className="mb-4 block border rounded-md p-3">
        <div className="font-bold">Owner: {shortenAddress(owner)}</div>
        <div className="flex gap-x-5">
          <div>Balance: {toEther(currentBalance)} ETH</div>
          <div>Min: USD$ {minAmountInUSD.toString()}</div>
        </div>
        <div>
          <div className="font-bold">Funders:</div>
          {funders.length ? (
            funders.map((_) => (
              <div key={_.transactionHash} className="flex gap-x-5">
                <div>Wallet: {shortenAddress(_.args._address)}</div>
                <div>Amount: {toEther(_.args._amount)} ETH</div>
              </div>
            ))
          ) : (
            <div>There are no funders yet</div>
          )}
        </div>
      </div>

      <AddFundsForm />
    </div>
  );
};
