import {
  appNetworks,
  storageFactoryContractAddress,
} from "@/contracts/networks";
import { readContract } from "thirdweb";
import {
  getServerSideContractByChainAndAddress,
  getStorageFactoryContractServerSideByNetwork,
} from "@/contracts/server";
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

  const addressList = await readContract({
    contract: getStorageFactoryContractServerSideByNetwork(validChain.chain),
    method:
      "function getAddressList() external view returns (address[] memory)",
    params: [],
  });

  return (
    <div className="px-4">
      <div className="mb-4">
        <div className="font-bold">
          StorageFactory Contract: {validChain.chain.name}
        </div>
        <div>List of classrooms:</div>
      </div>
      <div className="space-y-4">
        {addressList.length ? (
          addressList.map(async (_) => {
            const contractChain = appNetworks.filter(
              (item) => item.path === chainName
            )[0].chain;
            const course = await readContract({
              contract: getServerSideContractByChainAndAddress(
                contractChain,
                _
              ),
              method:
                "function getCourse() external view returns (string memory)",
              params: [],
            });
            return (
              <Link
                href={`${chainName}/${_}`}
                key={_}
                className="block border rounded-md p-3"
              >
                <div>Contract Address: {shortenAddress(_)}</div>
                <div>Course: {course}</div>
              </Link>
            );
          })
        ) : (
          <div>There are no classrooms created yet</div>
        )}
      </div>
    </div>
  );
}
