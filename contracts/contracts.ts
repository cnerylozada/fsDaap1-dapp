import { AppChainId, appNetworkPathRecord, IAppContact } from "./settings";

export const storageFactoryContracts: IAppContact[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0xb4bd38b220A43749b87e62f5f6f00D899Ec8a6B9",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
  {
    chainId: AppChainId.arbitrumSepolia,
    address: "0x2e49a9AF3d708925584dcfA5624b2e2D57FB8E9d",
    path: appNetworkPathRecord[AppChainId.arbitrumSepolia],
  },
];

export const fundMeFactoryContracts: IAppContact[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x666d5cbA00903891b328523eF3F153b00bcBE55B",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
  {
    chainId: AppChainId.arbitrumSepolia,
    address: "0xdEb107b39c48D5345030e72c3895836cBD9eeF7C",
    path: appNetworkPathRecord[AppChainId.arbitrumSepolia],
  },
];

export const lotteryFactoryContracts: IAppContact[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x66970cF63EEB194Afa916Ac2E7C082f2d16fBfE9",
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
