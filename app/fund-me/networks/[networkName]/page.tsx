import { getAppChainIdByPath } from "@/components/utils/contracts";
import { getDateAndTime } from "@/components/utils/utils";
import { getContractByChainAndAddress } from "@/contracts/server";
import { fundMeFactoryContracts } from "@/contracts/contracts";
import { appNetworkPathRecord } from "@/contracts/settings";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContractEvents, prepareEvent } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string }>;
}) {
  const { networkName } = await params;
  const isValidNetwork = Object.values(appNetworkPathRecord).find(
    (_) => _ === networkName
  );
  if (!isValidNetwork) return notFound();

  const appChainId = getAppChainIdByPath(networkName);
  const appContract = fundMeFactoryContracts.filter(
    (_) => _.chainId === appChainId
  )[0];

  const newCrowdFundingEvent = prepareEvent({
    signature:
      "event NewCrowdFunding(address indexed _address, uint _createdAt, string _title, string _description, uint _minAmountInUsd, address _priceFeedAddress, int _priceFeedDecimals)",
  });
  const crowdFundingList = await getContractEvents({
    contract: getContractByChainAndAddress(
      appContract.chainId,
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
          href={`./${networkName}/new-contract`}
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
                  href={`${networkName}/${args._address}`}
                  className="block border rounded-md p-3"
                >
                  <div>Title: {args._title}</div>
                  <div>Address: {shortenAddress(args._address)}</div>
                  <div>Created at: {getDateAndTime(args._createdAt)}</div>
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
