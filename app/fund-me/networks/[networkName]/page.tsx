import { getDateAndTime } from "@/components/utils/utils";
import { fundMeFactoryContracts } from "@/contracts/contracts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { shortenAddress } from "thirdweb/utils";
import { getCrowdFundingList } from "@/server/crow-funding";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string }>;
}) {
  const { networkName } = await params;
  const fundMeFactory = fundMeFactoryContracts.find(
    (_) => _.path === networkName
  );
  if (!fundMeFactory) return notFound();

  const crowdFundingList = await getCrowdFundingList(
    fundMeFactory.chainId,
    fundMeFactory.address
  );

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
              const contractAddress = _[0];
              const createdAt = _[1];
              const metadata = _[2];
              return (
                <Link
                  key={contractAddress}
                  href={`${networkName}/${contractAddress}`}
                  className="block border rounded-md p-3"
                >
                  <div>Title: {metadata[0]}</div>
                  <div>Address: {shortenAddress(contractAddress)}</div>
                  <div>Created at: {getDateAndTime(createdAt)}</div>
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
