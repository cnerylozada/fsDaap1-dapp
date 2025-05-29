import { whiteListFactoryContracts } from "@/contracts/contracts";
import { getContractByChainAndAddress } from "@/contracts/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readContract } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string }>;
}) {
  const { networkName } = await params;
  const whiteListFactory = whiteListFactoryContracts.find(
    (_) => _.path === networkName
  );
  if (!whiteListFactory) return notFound();

  const audiences = await readContract({
    contract: getContractByChainAndAddress(
      whiteListFactory.chainId,
      whiteListFactory.address
    ),
    method:
      "function getCreatedLists() external view returns ((address,address,address,address)[] memory)",
    params: [],
  });

  return (
    <div className="p-4 space-y-4">
      <div>
        <Link
          href={`./${networkName}/new-contract`}
          className="p-2 bg-blue-100 rounded-md"
        >
          Create new WhiteList
        </Link>
      </div>
      <div>
        {audiences.length ? (
          <>
            <div className="mb-2 font-bold">List of audiences:</div>
            <div className="space-y-4">
              {audiences.map((_) => {
                const contractAddress = _[0];
                const database = _[1];
                const destinyMinter = _[2];
                const arbitrumSepoliaSourceMinter = _[3];

                return (
                  <Link
                    href={`./${networkName}/${contractAddress}`}
                    key={contractAddress}
                    className="block border rounded-md p-3"
                  >
                    <div>NFT OnChain: {shortenAddress(contractAddress)}</div>
                    <div>Users database: {shortenAddress(database)}</div>
                    <div>Destiny minter: {shortenAddress(destinyMinter)}</div>
                    <div>
                      Arbitrum Source minter:{" "}
                      {shortenAddress(arbitrumSepoliaSourceMinter)}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div>There are no audiences created yet</div>
        )}
      </div>
    </div>
  );
}
