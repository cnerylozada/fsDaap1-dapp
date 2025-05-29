import { whiteListFactoryContracts } from "@/contracts/contracts";
import { appNetworkRecord } from "@/contracts/settings";
import Link from "next/link";

export default function Page() {
  return (
    <div className="p-4 space-y-4">
      <div className="font-bold">White-list Factory Contract</div>
      <div>
        <div className="mb-2">Select your network:</div>
        <div className="space-x-4">
          {whiteListFactoryContracts.map((_) => (
            <div key={_.address} className="border rounded-md p-1 inline-block">
              <Link href={`white-list/networks/${_.path}`}>
                {appNetworkRecord[_.chainId]?.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
