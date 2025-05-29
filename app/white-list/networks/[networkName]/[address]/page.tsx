import { whiteListFactoryContracts } from "@/contracts/contracts";
import { notFound } from "next/navigation";
import { isAddress } from "thirdweb";
import Link from "next/link";
import { UsersDB } from "./_components/Users";
import { ClaimTicket } from "./_components/ClaimTicket";
import { getWhiteListCustomers } from "@/server/cross-minting";

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

  const customers = await getWhiteListCustomers(
    whiteListFactory.chainId,
    address
  );

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
