import { storageFactoryContracts } from "@/contracts/contracts";
import Link from "next/link";
import { appNetworkPathRecord, appNetworkRecord } from "@/contracts/settings";

export default async function Page() {
  return (
    <div className="px-4 space-y-4">
      <div>
        <div className="font-bold">Storage Factory Contract</div>
        <div>Select your network:</div>
        <div className="space-x-4">
          {storageFactoryContracts.map((_) => (
            <div key={_.address} className="border rounded-md p-1 inline-block">
              <Link
                href={`storage/networks/${appNetworkPathRecord[_.chainId]}`}
              >
                {appNetworkRecord[_.chainId]?.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
