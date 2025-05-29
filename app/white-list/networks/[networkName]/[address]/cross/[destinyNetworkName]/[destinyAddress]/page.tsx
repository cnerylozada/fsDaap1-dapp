import {
  sourceMinterFactoryContract,
  whiteListFactoryContracts,
} from "@/contracts/contracts";
import { notFound } from "next/navigation";
import { isAddress } from "thirdweb";
import Link from "next/link";
import { CrossClaimTicket } from "../../../_components/CrossClaimTicket";
import { getWhiteListCustomers } from "@/server/cross-minting";

export default async function Page({
  params,
}: {
  params: Promise<{
    networkName: string;
    address: string;
    destinyNetworkName: string;
    destinyAddress: string;
  }>;
}) {
  const { networkName, address, destinyNetworkName, destinyAddress } =
    await params;

  const whiteListFactory = whiteListFactoryContracts.find(
    (_) => _.path === destinyNetworkName
  );

  if (
    sourceMinterFactoryContract.path !== networkName ||
    !isAddress(address) ||
    !whiteListFactory
  )
    return notFound();

  const customers = await getWhiteListCustomers(
    whiteListFactory.chainId,
    destinyAddress
  );
  console.log(`customers`, customers);

  return (
    <div className="p-4 space-y-4">
      <div className="text-right">
        <Link
          href={`/white-list/networks/${destinyNetworkName}`}
          className="text-blue-700"
        >
          Go back to list of audiences
        </Link>
      </div>

      <CrossClaimTicket customers={customers} />
    </div>
  );
}
