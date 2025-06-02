import { LINKTokenContracts } from "@/contracts/chainlink";
import { AppChainId } from "@/contracts/settings";
import { ChainOptions } from "thirdweb/chains";

export const formatToValidPath = (chain: ChainOptions) => {
  if (!chain.name) return "";
  const text = chain.name;
  const lowercase = text.toLowerCase();
  const hyphenated = lowercase.replace(/\s+/g, "-");
  const cleaned = hyphenated.replace(/[^a-z0-9-]/g, "");
  return cleaned;
};

export const getDateAndTime = (timestamp: bigint) => {
  const date = new Date(+timestamp.toString() * 1000);
  return date.toLocaleString("en-US", {
    timeZoneName: "short",
  });
};

// export const getTokenAddressList = (currentChainId: AppChainId) => {
//   const LINKToken = LINKTokenContracts.find(
//     (_) => _.chainId === currentChainId
//   );
//   const tokenAddressList = LINKToken ? ["", LINKToken.address] : [""];
//   return tokenAddressList;
// };
