import { notFound } from "next/navigation";
import { ActiveSubscriptions } from "./_components/ActiveSubscriptions";
import Link from "next/link";
import { chainlinkVRFCoordinatorContracts } from "@/contracts/chainlink";

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
    <div className="p-4 space-y-4">
      <div className="font-bold">Create new Lottery</div>
      <div className="underline text-blue-700">
        <Link href={"./get-links"}>
          Not enough LINKs? Change them for your ETHs
        </Link>
      </div>
      <ActiveSubscriptions />
    </div>
  );
}
