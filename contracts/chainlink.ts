import { AppChainId, appNetworkPathRecord, IAppContact } from "./settings";

export const chainlinkVRFCoordinatorContracts: IAppContact[] = [
  {
    chainId: AppChainId.sepolia,
    address: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
    path: appNetworkPathRecord[AppChainId.sepolia],
  },
];

export const chainlinkVRFSupportedNetworks = [
  {
    chainId: AppChainId.sepolia,
    LINKToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  },
];
