import { AppChainId, appNetworkPathRecord, IAppContact } from "./settings";

export const chainlinkVRFCoordinatorContracts: IAppContact[] = [
  {
    chainId: AppChainId.sepolia,
    address: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
    path: appNetworkPathRecord[AppChainId.sepolia],
  },
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x0",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
];

export const chainlinkVRFSupportedNetworks = [
  {
    chainId: AppChainId.sepolia,
    LINKToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  },
  {
    chainId: AppChainId.optimismSepolia,
    LINKToken: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
  },
  {
    chainId: AppChainId.arbitrumSepolia,
    LINKToken: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
  },
];
