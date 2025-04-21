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
    address: "0x2e4c03Dce41b6C45A73432C8ea98261158DD7F1F",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
  {
    chainId: AppChainId.arbitrumSepolia,
    address: "0xdEb107b39c48D5345030e72c3895836cBD9eeF7C",
    path: appNetworkPathRecord[AppChainId.arbitrumSepolia],
  },
  {
    chainId: AppChainId.sepolia,
    address: "0xfeD58721897c20694B5598f0a4D438eadf90B0C2",
    path: appNetworkPathRecord[AppChainId.sepolia],
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
    chainId: AppChainId.sepolia,
    address: "0x932856dDa48a0857a276E360FE2E84Db061a9A80",
  },
  {
    chainId: AppChainId.optimismSepolia,
    address: "0xDd9c3BCF5A4d6b00DBcf783f37F48E8ED4787324",
  },
];
