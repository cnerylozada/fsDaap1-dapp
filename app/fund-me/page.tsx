import { fundMeFactoryContracts } from "@/contracts/contracts";
import { appNetworkPathRecord, appNetworkRecord } from "@/contracts/settings";
import Link from "next/link";

export default function Page() {
  return (
    <div className="p-4">
      <div>
        <div className="font-bold">FundMe Factory Contract</div>
        <div>Select your network:</div>
        <div className="space-x-4">
          {fundMeFactoryContracts.map((_) => (
            <div key={_.address} className="border rounded-md p-1 inline-block">
              <Link
                href={`fund-me/networks/${appNetworkPathRecord[_.chainId]}`}
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
