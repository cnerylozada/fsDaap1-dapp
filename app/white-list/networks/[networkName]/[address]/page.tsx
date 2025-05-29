import { whiteListFactoryContracts } from "@/contracts/contracts";
import { notFound } from "next/navigation";
import { isAddress, readContract } from "thirdweb";
import Link from "next/link";
import { UsersDB } from "./_components/Users";
import { getContractByChainAndAddress } from "@/contracts/server";
import { ClaimTicket } from "./_components/ClaimTicket";

export default async function Page({
  params,
}: {
  params: Promise<{ address: string; networkName: string }>;
}) {
  const { address, networkName } = await params;
  const whiteListFactory = whiteListFactoryContracts.find(
    (_) => _.path === networkName
  );
  if (!whiteListFactory || !isAddress(address)) return notFound();

  const DBAddress = await readContract({
    contract: getContractByChainAndAddress(whiteListFactory.chainId, address),
    method: "function getDBAddress() external view returns (address)",
    params: [],
  });

  const customers = await readContract({
    contract: getContractByChainAndAddress(whiteListFactory.chainId, DBAddress),
    method:
      "function getUsers() external view returns ((address,uint256)[] memory)",
    params: [],
  });

  return (
    <div className="p-4 space-y-4">
      <div className="text-right">
        <Link href={`./`} className="text-blue-700">
          Go back
        </Link>
      </div>
      <UsersDB customers={customers} />

      <ClaimTicket customers={customers} />
    </div>
  );
}
