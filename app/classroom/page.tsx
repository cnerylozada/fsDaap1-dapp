import { classroomFactoryContracts } from "@/contracts/contracts";
import Link from "next/link";
import { appNetworkPathRecord, appNetworkRecord } from "@/contracts/settings";

export default async function Page() {
  return (
    <div className="p-4 space-y-4">
      <div className="font-bold">Classroom Factory Contract</div>
      <div>
        <div className="mb-2">Select your network:</div>
        <div className="space-x-4">
          {classroomFactoryContracts.map((_) => (
            <div key={_.address} className="border rounded-md p-1 inline-block">
              <Link
                href={`classroom/networks/${appNetworkPathRecord[_.chainId]}`}
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
