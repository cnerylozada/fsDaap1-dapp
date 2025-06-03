import { lotteryFactoryContracts } from "@/contracts/contracts";
import { appNetworkRecord } from "@/contracts/settings";
import Link from "next/link";

export default function Page() {
  return (
    <div className="p-4 space-y-4">
      <div className="font-bold">Lottery Factory Contract</div>
      <div>
        <div className="font-bold">Key features:</div>
        <ul className="list-disc list-inside">
          <li>Perform on-chain randomness using chainlink-vrf</li>
          <li>
            Trigger on-chain smart contract logic in certain date using
            chainlink-automation
          </li>
          <li>Fund chainlink subscriptions programmatically</li>
          <li>Manage of custom interfaces and WETH in smart contracts</li>
          <li>
            Use of uniswap v2 contract to exchange ETH for CHAINLINK tokens
            (only for sepolia testnet)
          </li>
          <li>Get events data by on-chain transactions</li>
          <li>Get tokens balance from wallet</li>
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
          {lotteryFactoryContracts.map((_) => (
            <div key={_.address} className="border rounded-md p-1 inline-block">
              <Link href={`lottery/networks/${_.path}`}>
                {appNetworkRecord[_.chainId]?.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
