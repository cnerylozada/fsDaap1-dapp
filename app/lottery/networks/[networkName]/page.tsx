import { chainlinkVRFCoordinatorContracts } from "@/contracts/chainlink";
import Link from "next/link";
import { notFound } from "next/navigation";

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
      <div>
        <Link
          href={`./${networkName}/new-contract`}
          className="p-2 bg-blue-100 rounded-md"
        >
          Create new Lottery
        </Link>
      </div>
    </div>
  );
}
