import { notFound } from "next/navigation";
import { chainlinkVRFCoordinatorContracts } from "@/contracts/chainlink";
import { LotteryCreationFlow } from "./_components/LotteryCreationFlow";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string }>;
}) {
  const { networkName } = await params;
  const isValidNetwork = chainlinkVRFCoordinatorContracts.find(
    (_) => _.path === networkName
  );
  if (!isValidNetwork) return notFound();

  return (
    <div className="p-4">
      <div className="font-bold">Create new Lottery</div>
      <LotteryCreationFlow />
    </div>
  );
}
