import { fundMeFactoryContracts } from "@/contracts/contracts";
import { appNetworkPathRecord, appNetworkRecord } from "@/contracts/settings";
import Link from "next/link";

export default function Page() {
  return (
    <div className="p-4 space-y-4">
      <div className="font-bold">FundMe Factory Contract</div>
      <div>
        <div className="font-bold">Key features:</div>
        <ul className="list-disc list-inside">
          <li>
            Send and receive tokens to different wallets from smart contracts
          </li>
          <li>
            Get price of different coins based in real-world data using
            chainlink-data-feeds
          </li>
          <li>
            Deploying of contracts for different networks is performed by
            hardhat ignition
          </li>
          <li>Solidity best practices</li>
          <li>Use of mocks from chainlink to unit testing</li>
          <li>All the smart contracts are tested in hardhat</li>
        </ul>
      </div>

      <div>
        <div className="mb-2">Select your network:</div>
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
