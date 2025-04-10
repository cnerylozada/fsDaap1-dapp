import { getDateAndTime } from "@/components/utils/utils";
import { lotteryFactoryContracts } from "@/contracts/contracts";
import { getContractByChainAndAddress } from "@/contracts/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContractEvents, prepareEvent, toEther } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string }>;
}) {
  const { networkName } = await params;
  const isValidNetwork = lotteryFactoryContracts.find(
    (_) => _.path === networkName
  );
  if (!isValidNetwork) return notFound();

  const newLotteryEvent = prepareEvent({
    signature:
      "event NewLottery(address indexed _address, uint _createdAt, (string,string,address,uint256,uint256,uint256,uint256) _detail)",
  });

  const lotteryList = await getContractEvents({
    contract: getContractByChainAndAddress(
      isValidNetwork.chainId,
      isValidNetwork.address
    ),
    events: [newLotteryEvent],
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
          Create new Lottery
        </Link>
      </div>
      <div>
        {lotteryList.length ? (
          <>
            <div className="mb-2 font-bold">List of lotteries:</div>
            <div className="space-y-4">
              {lotteryList.map(({ args, transactionHash }) => {
                const { _detail, _createdAt } = args;
                return (
                  <div
                    key={transactionHash}
                    className="block border rounded-md p-3"
                  >
                    <div>Title: {_detail[0]} </div>
                    <div>Owner: {shortenAddress(_detail[2])}</div>
                    <div>Prize: {toEther(_detail[6])} ETH</div>
                    <div>Created at: {getDateAndTime(_createdAt)}</div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div>There are no lottery created yet</div>
        )}
      </div>
    </div>
  );
}
