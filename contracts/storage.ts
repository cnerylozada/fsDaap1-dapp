import { thirdwebClientSide } from "@/lib/thirdweb";
import { getContract } from "thirdweb";
import { optimismSepolia } from "thirdweb/chains";

export const storageContractOpSepolia = getContract({
  client: thirdwebClientSide,
  address: "0xb534EbB6309D6E9D3CF222C16a1b55FfE19f1c87",
  chain: optimismSepolia,
});
