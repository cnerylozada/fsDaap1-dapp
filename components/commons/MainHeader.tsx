import { ConnectWallet } from "./ConnectWallet";

export const MainHeader = () => {
  return (
    <div className="mb-3 p-3 flex items-center border-b-2">
      <div className="flex-grow">Main Header</div>
      <div>
        <ConnectWallet />
      </div>
    </div>
  );
};
