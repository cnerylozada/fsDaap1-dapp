import { thirdwebClientSide } from "@/lib/thirdweb/client";
import { getContract } from "thirdweb";
import { optimismSepolia } from "thirdweb/chains";
import { storageContractAddress } from "./addresses";

export const storageContractClientSideOpSepolia = getContract({
  client: thirdwebClientSide,
  address: storageContractAddress.opSepolia,
  chain: optimismSepolia,
});
