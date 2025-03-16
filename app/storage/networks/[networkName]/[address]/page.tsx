import { Students } from "@/app/storage/_components/Students";
import { getDateAndTime } from "@/components/utils/utils";
import { storageFactoryContracts } from "@/contracts/contracts";
import { getContractByChainAndAddress } from "@/contracts/server";
import { notFound } from "next/navigation";
import { readContract } from "thirdweb";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string; address: string }>;
}) {
  const { address, networkName } = await params;
  const isValidNetwork = storageFactoryContracts.find(
    (_) => _.path === networkName
  );
  if (!isValidNetwork) return notFound();

  const [course, createdAt] = await readContract({
    contract: getContractByChainAndAddress(isValidNetwork.chainId, address),
    method:
      "function getMetadata() external view returns (string memory, uint)",
    params: [],
  });

  return (
    <div className="px-4">
      <div>Course: {course} </div>
      <div>Created at: {getDateAndTime(createdAt)} </div>
      <Students />
    </div>
  );
}
