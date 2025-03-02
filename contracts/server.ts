import { thirdwebServerSide } from "@/lib/thirdweb/server";
import { getContract } from "thirdweb";
import { optimismSepolia } from "thirdweb/chains";
import { storageContractAddress } from "./addresses";

export const storageContractServerSideOpSepolia = getContract({
  client: thirdwebServerSide,
  address: storageContractAddress.opSepolia,
  chain: optimismSepolia,
});
