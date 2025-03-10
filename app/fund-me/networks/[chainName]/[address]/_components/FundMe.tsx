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

  const [currentBalance, minAmountInUSD, funders] = await Promise.all([
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
      <div className="mb-4">
        <div>CrowdFunding</div>
        <div>getBalance: {toEther(currentBalance)} ETH</div>
        <div>getMinAmountInUSD: USD$ {minAmountInUSD.toString()}</div>
        <div>
          <div>Funders:</div>
          {funders.map((_) => (
            <div key={_.transactionHash}>
              <div>User Address: {shortenAddress(_.args._address)}</div>
              <div>Amount: {toEther(_.args._amount)} ETH</div>
            </div>
          ))}
        </div>
      </div>

      <AddFundsForm />
    </div>
  );
};
