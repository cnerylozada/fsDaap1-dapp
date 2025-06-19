import { CHAINLINK_TOKEN_DECIMALS } from "@/components/utils/contracts";

export const AMOUNT_TO_FUND_VRF_COORDINATOR = BigInt(
  2.5 * 10 ** CHAINLINK_TOKEN_DECIMALS
);
export const AMOUNT_TO_FUND_AUTOMATION = BigInt(
  0.4 * 10 ** CHAINLINK_TOKEN_DECIMALS
);
