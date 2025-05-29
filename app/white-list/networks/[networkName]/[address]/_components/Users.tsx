import { AppChainId, appNetworkRecord } from "@/contracts/settings";
import { shortenAddress } from "thirdweb/utils";

export const UsersDB = async ({
  customers,
}: {
  customers: readonly (readonly [string, bigint])[];
}) => {
  return (
    <div className="border rounded-md p-3">
      {customers.map((_, index) => {
        const walletAddress = _[0];
        const chainId = +_[1].toString() as AppChainId;

        return (
          <div key={index}>
            <div>Customer #{index + 1}</div>
            <div> Wallet address: {shortenAddress(walletAddress)}</div>
            <div> Network: {appNetworkRecord[chainId]?.name}</div>
          </div>
        );
      })}
    </div>
  );
};
