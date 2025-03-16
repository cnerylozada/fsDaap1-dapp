import { chainlinkVRFCoordinatorContracts } from "@/contracts/contracts";
import Link from "next/link";

export default function Page() {
  return (
    <div className="p-4">
      <div className="font-bold">Lottery Factory Contract</div>
      <div>Select your network:</div>
      <div className="space-x-4">
        {chainlinkVRFCoordinatorContracts.map((_) => (
          <div key={_.address} className="border rounded-md p-1 inline-block">
            <Link href={`lottery/networks/${_.path}`}>{_.path}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
