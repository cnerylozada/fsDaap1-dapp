import { AppChainId, appNetworkPathRecord, IAppContact } from "./settings";

export const storageFactoryContracts: IAppContact[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x23dF64F029C525db788fD416Cb0Bc24f8B82496e",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
  {
    chainId: AppChainId.arbitrumSepolia,
    address: "0xdda090443d506d10530c4f2B5159634230a3484D",
    path: appNetworkPathRecord[AppChainId.arbitrumSepolia],
  },
];

export const fundMeFactoryContracts: IAppContact[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x81F24c2654dC74Ada49ec3AEa415B94e89Eb5DDC",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
  {
    chainId: AppChainId.arbitrumSepolia,
    address: "0xF50b41c16ABAcDa7eeEaCbb185662B36B9DA3dE3",
    path: appNetworkPathRecord[AppChainId.arbitrumSepolia],
  },
];
export const chainlinkVRFCoordinatorContracts: IAppContact[] = [
  {
    chainId: AppChainId.sepolia,
    address: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
    path: appNetworkPathRecord[AppChainId.sepolia],
  },
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x02667f44a6a44E4BDddCF80e724512Ad3426B17d",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
  {
    chainId: AppChainId.arbitrumSepolia,
    address: "0x5CE8D5A2BC84beb22a398CCA51996F7930313D61",
    path: appNetworkPathRecord[AppChainId.arbitrumSepolia],
  },
];
