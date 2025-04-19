import { lotteryFactoryContracts } from "@/contracts/contracts";
import { Metadata } from "./_components/Metadata";
import { notFound } from "next/navigation";
import { getContractByChainAndAddress } from "@/contracts/server";
import { Lottery } from "./_components/Lottery";

export default async function Page({
  params,
}: {
  params: Promise<{ address: string; networkName: string }>;
}) {
  const { address, networkName } = await params;
  const isValidNetwork = lotteryFactoryContracts.find(
    (_) => _.path === networkName
  );
  if (!isValidNetwork) return notFound();

  const lotteryFactoryContract = getContractByChainAndAddress(
    isValidNetwork.chainId,
    isValidNetwork.address
  );

  return (
    <div className="p-4 space-y-4">
      <Metadata
        address={address}
        lotteryFactoryContract={lotteryFactoryContract}
      />
      <Lottery currentChainId={isValidNetwork.chainId} address={address} />
    </div>
  );
}
