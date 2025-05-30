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
    address: "0x04255eB407C59f928aE9399bc494e032C419a0c5",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
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
    address: "0x8D69cEFf900A8EA4a1Df5C1b1c9DB0e71e0260BA",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
];

export const sourceMinterFactoryContract: IAppContract = {
  chainId: AppChainId.arbitrumSepolia,
  address: "0xe71AfF81de4451020a21F7FEF4952B5e6A7EB4c0",
  path: appNetworkPathRecord[AppChainId.arbitrumSepolia],
};
