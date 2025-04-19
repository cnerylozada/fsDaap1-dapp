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

export const lotteryFactoryContracts: IAppContact[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x2e4c03Dce41b6C45A73432C8ea98261158DD7F1F",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
  {
    chainId: AppChainId.arbitrumSepolia,
    address: "0xB989376a524ac8dbd2722057eB581c47d6c8173C",
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
