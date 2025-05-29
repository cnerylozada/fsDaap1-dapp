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
    address: "0x0f7b015884168821DF2d9fCD8DB1322A4392b1DD",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
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
