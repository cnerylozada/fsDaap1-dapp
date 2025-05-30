import { AppChainId, appNetworkPathRecord, IAppContract } from "./settings";

export const chainlinkVRFCoordinatorContracts: (IAppContract & {
  keyHash: `0x${string}`;
})[] = [
  {
    chainId: AppChainId.sepolia,
    address: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
    path: appNetworkPathRecord[AppChainId.sepolia],
    keyHash:
      "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
  },
  {
    chainId: AppChainId.optimismSepolia,
    address: "0x02667f44a6a44E4BDddCF80e724512Ad3426B17d",
    path: appNetworkPathRecord[AppChainId.optimismSepolia],
    keyHash:
      "0xc3d5bc4d5600fa71f7a50b9ad841f14f24f9ca4236fd00bdb5fda56b052b28a4",
  },
  {
    chainId: AppChainId.arbitrumSepolia,
    address: "0x5CE8D5A2BC84beb22a398CCA51996F7930313D61",
    path: appNetworkPathRecord[AppChainId.arbitrumSepolia],
    keyHash:
      "0x1770bdc7eec7771f7ba4ffd640f34260d7f095b79c92d34a5b2551d6f6cfd2be",
  },
];

export const LINKTokenContracts: Pick<IAppContract, "chainId" | "address">[] = [
  {
    chainId: AppChainId.sepolia,
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  },
  {
    chainId: AppChainId.optimismSepolia,
    address: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
  },
  {
    chainId: AppChainId.arbitrumSepolia,
    address: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
  },
];
