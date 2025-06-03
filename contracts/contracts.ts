import { AppChainId, appNetworkPathRecord, IAppContract } from "./settings";

export const classroomFactoryContracts: IAppContract[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x493de640Fb67583Becab98000Ac21159EB10f28D",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
];

export const fundMeFactoryContracts: IAppContract[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x2F8c2362B74D0b800A39b1fD9A739fdb41E31584",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
];

export const lotteryFactoryContracts: IAppContract[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0xf2C25cde699B9b447751c240ef7D46271CFFc4eb",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
  {
    chainId: AppChainId.sepolia,
    address: "0x079E9738Ab76023583D7EEC89d6B681c5a6a72aA",
    path: appNetworkPathRecord[AppChainId.sepolia],
  },
];

export const basicUniswapV2Contracts: IAppContract[] = [
  {
    chainId: AppChainId.sepolia,
    address: "0x81aaD1e048f6D253385e20DD7C9028cFd887fBA5",
    path: appNetworkPathRecord[AppChainId.sepolia],
  },
];

export const registerUpkeepContracts: {
  chainId: AppChainId;
  address: string;
}[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0xb2E45cf120B63A406B92F8A00f5A385854788BD4",
  },
];

export const whiteListFactoryContracts: IAppContract[] = [
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x00C7e99156d4dA579979Ca40EBf64d9091947007",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
];

export const sourceMinterFactoryContract: IAppContract = {
  chainId: AppChainId.arbitrumSepolia,
  address: "0xe71AfF81de4451020a21F7FEF4952B5e6A7EB4c0",
  path: appNetworkPathRecord[AppChainId.arbitrumSepolia],
};
