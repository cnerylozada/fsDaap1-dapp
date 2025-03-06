import {
  appNetworks,
  storageFactoryContractAddress,
} from "@/contracts/networks";
import { getContractEvents, prepareEvent } from "thirdweb";
import { getStorageFactoryContractServerSideByNetwork } from "@/contracts/server";
import { shortenAddress } from "thirdweb/utils";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ chainName: string }>;
}) {
  const { chainName } = await params;
  const validChain = storageFactoryContractAddress
    .map((_) => ({
      ...appNetworks.filter((item) => item.chain === _.chain)[0],
    }))
    .find((_) => _.path === chainName);
  if (!validChain) return notFound();

  const newContractCreatedEvent = prepareEvent({
    signature: "event NewContractCreated(address _address, string _course)",
  });
  const storageFactoryEvents = await getContractEvents({
    contract: getStorageFactoryContractServerSideByNetwork(validChain.chain),
    events: [newContractCreatedEvent],
    fromBlock: "earliest",
    toBlock: "latest",
  });

  return (
    <div className="p-4 space-y-4">
      <div>
        <div className="font-bold">
          StorageFactory Contract: {validChain.chain.name}
        </div>
      </div>

      <div>
        <Link
          href={`./${chainName}/new-contract`}
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
                  href={`${chainName}/${args._address}`}
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
