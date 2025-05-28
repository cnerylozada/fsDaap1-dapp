import { lotteryFactoryContracts } from "@/contracts/contracts";
import { Metadata } from "./_components/Metadata";
import { notFound } from "next/navigation";
import { Lottery } from "./_components/Lottery";
import { isAddress } from "thirdweb";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ address: string; networkName: string }>;
}) {
  const { address, networkName } = await params;
  const lotteryFactory = lotteryFactoryContracts.find(
    (_) => _.path === networkName
  );
  if (!lotteryFactory || !isAddress(address)) return notFound();

  return (
    <div className="p-4 space-y-4">
      <div className="text-right">
        <Link href={`./`} className="text-blue-700">
          Go back
        </Link>
      </div>

      <Metadata lotteryFactory={lotteryFactory} address={address} />
      <Lottery currentChainId={lotteryFactory.chainId} address={address} />
    </div>
  );
}
