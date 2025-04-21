import { readContract } from "thirdweb";
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

  const storageContractList = await readContract({
    contract: getContractByChainAndAddress(
      storageFactory.chainId,
      storageFactory.address
    ),
    method:
      "function contractsCreated() external view returns ((address, string)[] memory)",
    params: [],
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
          {storageContractList.length ? (
            storageContractList.map(async (_) => {
              return (
                <Link
                  href={`${networkName}/${_[0]}`}
                  key={_[0]}
                  className="block border rounded-md p-3"
                >
                  <div>Contract Address: {shortenAddress(_[0])}</div>
                  <div>Course: {_[1]}</div>
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
