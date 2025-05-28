import { AppChainId, appNetworkPathRecord, IAppContract } from "./settings";

export const classroomFactoryContracts: IAppContract[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x85002AE4b35B36ffBC085C662916A8522FD31eB7",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
];

export const fundMeFactoryContracts: IAppContract[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x04B0789b3007Ff4B863f05eb529b08FBe629b981",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
];

export const lotteryFactoryContracts: IAppContract[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x688bA2501Fa4117a23b938111d3401bF462319ba",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
];

export const basicUniswapV2Contracts: IAppContract[] = [
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
