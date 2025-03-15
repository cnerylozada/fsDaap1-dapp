import { Students } from "@/app/storage/_components/Students";
import { getAppChainIdByPath } from "@/components/utils/contracts";
import { getDateAndTime } from "@/components/utils/utils";
import { getContractByChainAndAddress } from "@/contracts/server";
import { readContract } from "thirdweb";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string; address: string }>;
}) {
  const { address, networkName } = await params;

  const appChainId = getAppChainIdByPath(networkName);

  const [course, createdAt] = await readContract({
    contract: getContractByChainAndAddress(appChainId, address),
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
