import { AppChainId, appNetworkPathRecord, IAppContact } from "./settings";

export const classroomFactoryContracts: IAppContact[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x76A4589E0A3f43b9532B517a65479F84a02B4b9a",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
  {
    chainId: AppChainId.arbitrumSepolia,
    address: "0x5f5e23a3b3ca95545e9487389Ef88D92a8bfaC47",
    path: appNetworkPathRecord[AppChainId.arbitrumSepolia],
  },
];

export const fundMeFactoryContracts: IAppContact[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0xdA01A25d0c241cA1CaBC0Cf89438873DeF6e3D2d",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
  {
    chainId: AppChainId.arbitrumSepolia,
    address: "0x7f3B3e3cF75730D8b825d360E26E6EEb8afCcF59",
    path: appNetworkPathRecord[AppChainId.arbitrumSepolia],
  },
];

export const lotteryFactoryContracts: IAppContact[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x688bA2501Fa4117a23b938111d3401bF462319ba",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
];

export const basicUniswapV2Contracts: IAppContact[] = [
  {
    chainId: AppChainId.sepolia,
    address: "0x38E131d58Cc9D660Efe5251FB9feF895aFE6C6FC",
    path: appNetworkPathRecord[AppChainId.sepolia],
  },
];

export const registerUpkeepContracts: {
  chainId: AppChainId;
  address: string;
}[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x7367E8041101431ee9D28935Dc65a89DF9170fc5",
  },
  {
    chainId: AppChainId.arbitrumSepolia,
    address: "0x51273Eb85B6541Bf0e3800050bd8c2B8226ed38C",
  },
];

export const merkleContracts: {
  chainId: AppChainId;
  address: string;
}[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0xF886c7344DA944E18230aBF71B8f5c5DB58183a9",
  },
];
