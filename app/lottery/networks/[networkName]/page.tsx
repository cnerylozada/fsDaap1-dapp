import { getDateAndTime } from "@/components/utils/utils";
import { lotteryFactoryContracts } from "@/contracts/contracts";
import { getLotteryList } from "@/server/lottery";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toEther } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string }>;
}) {
  const { networkName } = await params;
  const lotteryFactory = lotteryFactoryContracts.find(
    (_) => _.path === networkName
  );
  if (!lotteryFactory) return notFound();

  const lotteryList = await getLotteryList(
    lotteryFactory.chainId,
    lotteryFactory.address
  );

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
              {lotteryList.map((_) => {
                const contractAddress = _[0];
                const createdAt = _[1];
                const metadata = _[2];

                return (
                  <Link
                    href={`./${networkName}/${contractAddress}`}
                    key={contractAddress}
                    className="block border rounded-md p-3"
                  >
                    <div>Title: {metadata[0]} </div>
                    <div>Owner: {shortenAddress(metadata[2])}</div>
                    <div>Prize: {toEther(metadata[6])} ETH</div>
                    <div>Event date: {getDateAndTime(metadata[3])}</div>
                    <div>Created at: {getDateAndTime(createdAt)}</div>
                  </Link>
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
