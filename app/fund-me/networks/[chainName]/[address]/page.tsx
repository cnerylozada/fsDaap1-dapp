import { getAppContractByChain } from "@/app/server/utils";
import { fundMeFactoryContractAddress } from "@/contracts/networks";
import { getServerSideContractByChainAndAddress } from "@/contracts/server";
import { notFound } from "next/navigation";
import { getContractEvents, prepareEvent } from "thirdweb";

export default async function Page({
  params,
}: {
  params: Promise<{ chainName: string; address: string }>;
}) {
  const { chainName, address } = await params;
  const appContract = getAppContractByChain(
    fundMeFactoryContractAddress,
    chainName
  );
  if (!appContract) return notFound();

  const newCrowdFundingEvent = prepareEvent({
    signature:
      "event NewCrowdFunding(address indexed _address, uint _createdAt, string _title, string _description, uint _minAmountInUsd, address _priceFeedAddress, int _priceFeedDecimals)",
    filters: { _address: address },
  });

  const crowdFundingDetail = await getContractEvents({
    contract: getServerSideContractByChainAndAddress(
      appContract.chain,
      appContract.address
    ),
    events: [newCrowdFundingEvent],
    fromBlock: "earliest",
    toBlock: "latest",
  });

  return (
    <div className="p-4">
      {crowdFundingDetail.map((_) => (
        <div key={_.transactionHash} className="block border rounded-md p-3">
          <div>Title: {_.args._title}</div>
          <div>Contract address: {_.args._address}</div>
          <div>Created at: {_.args._createdAt}</div>
          <div>Description: {_.args._description}</div>
        </div>
      ))}
    </div>
  );
}
