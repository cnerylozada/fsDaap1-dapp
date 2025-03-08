import { Students } from "@/app/storage/_components/Students";
import { appNetworks } from "@/contracts/networks";
import { getServerSideContractByChainAndAddress } from "@/contracts/server";
import { readContract } from "thirdweb";

export default async function Page({
  params,
}: {
  params: Promise<{ chainName: string; address: string }>;
}) {
  const { address, chainName } = await params;

  const contractChain = appNetworks.filter((item) => item.path === chainName)[0]
    .chain;

  const [course, createdAt] = await readContract({
    contract: getServerSideContractByChainAndAddress(contractChain, address),
    method:
      "function getMetadata() external view returns (string memory, uint)",
    params: [],
  });

  return (
    <div className="px-4">
      <div>Course: {course} </div>
      <div>Created at: {createdAt} </div>
      <Students />
    </div>
  );
}
