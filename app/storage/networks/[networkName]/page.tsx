import { getContractEvents, prepareEvent } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getContractByChainAndAddress } from "@/contracts/server";
import { storageFactoryContracts } from "@/contracts/contracts";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string }>;
}) {
  const { networkName } = await params;
  const storageFactory = storageFactoryContracts.find(
    (_) => _.path === networkName
  );
  if (!storageFactory) return notFound();

  const newContractCreatedEvent = prepareEvent({
    signature: "event NewContractCreated(address _address, string _course)",
  });
  const storageFactoryEvents = await getContractEvents({
    contract: getContractByChainAndAddress(
      storageFactory.chainId,
      storageFactory.address
    ),
    events: [newContractCreatedEvent],
    fromBlock: "earliest",
    toBlock: "latest",
  });

  return (
    <div className="p-4 space-y-4">
      <div>
        <div className="font-bold">
          StorageFactory Contract: {shortenAddress(storageFactory.address)}
        </div>
      </div>

      <div>
        <Link
          href={`./${networkName}/new-contract`}
          className="p-2 bg-blue-100 rounded-md"
        >
          Create new contract
        </Link>
      </div>

      <div>
        <div>List of classrooms:</div>
        <div className="space-y-4">
          {storageFactoryEvents.length ? (
            storageFactoryEvents.map(async (event) => {
              const { transactionHash, args } = event;
              return (
                <Link
                  href={`${networkName}/${args._address}`}
                  key={transactionHash}
                  className="block border rounded-md p-3"
                >
                  <div>Contract Address: {shortenAddress(args._address)}</div>
                  <div>Course: {args._course}</div>
                </Link>
              );
            })
          ) : (
            <div>There are no classrooms created yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
