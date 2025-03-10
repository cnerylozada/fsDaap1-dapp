import { getAppContractByChain } from "@/components/utils/contracts";
import { fundMeFactoryContractAddress } from "@/contracts/networks";
import { getServerSideContractByChainAndAddress } from "@/contracts/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContractEvents, prepareEvent } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ chainName: string }>;
}) {
  const { chainName } = await params;
  const appContract = getAppContractByChain(
    fundMeFactoryContractAddress,
    chainName
  );
  if (!appContract) return notFound();

  const newCrowdFundingEvent = prepareEvent({
    signature:
      "event NewCrowdFunding(address indexed _address, uint _createdAt, string _title, string _description, uint _minAmountInUsd, address _priceFeedAddress, int _priceFeedDecimals)",
  });

  const crowdFundingList = await getContractEvents({
    contract: getServerSideContractByChainAndAddress(
      appContract.chain,
      appContract.address
    ),
    events: [newCrowdFundingEvent],
    fromBlock: "earliest",
    toBlock: "latest",
  });

  return (
    <div className="p-4 space-y-4">
      <div>
        <Link
          href={`./${chainName}/new-contract`}
          className="p-2 bg-blue-100 rounded-md"
        >
          Create new contract
        </Link>
      </div>
      <div>
        <div className="mb-2 font-bold">List of crowd-funding:</div>
        <div className="space-y-4">
          {crowdFundingList.length ? (
            crowdFundingList.map((_) => {
              const { transactionHash, args } = _;
              return (
                <Link
                  key={transactionHash}
                  href={`${chainName}/${args._address}`}
                  className="block border rounded-md p-3"
                >
                  <div>Title: {args._title}</div>
                  <div>Address: {shortenAddress(args._address)}</div>
                  <div>Created at: {args._createdAt}</div>
                </Link>
              );
            })
          ) : (
            <div>There are no crowd-fundings created yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
