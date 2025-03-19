import Link from "next/link";
import { ConnectWallet } from "./ConnectWallet";

export const MainHeader = () => {
  return (
    <div className="mb-3 p-3 flex items-center border-b">
      <div className="flex-grow flex">
        <div>
          <Link href={"/"} className="font-bold">
            FSDAPP_1
          </Link>
        </div>
      </div>
      <div>
        <ConnectWallet />
      </div>
    </div>
  );
};
