"use server";
import { IToken } from "@/app/white-list/networks/[networkName]/[address]/cross/[destinyNetworkName]/[destinyAddress]/_components/models";
import { LINKTokenContracts } from "@/contracts/chainlink";
import { getContractByChainAndAddress } from "@/contracts/server";
import { AppChainId } from "@/contracts/settings";
import { Hex, readContract, toTokens } from "thirdweb";
import { decimals } from "thirdweb/extensions/erc20";
import { formatNumber } from "thirdweb/utils";

export const getWhiteListCustomers = async (
  chainId: AppChainId,
  contractAddress: string
) => {
  const DBAddress = await readContract({
    contract: getContractByChainAndAddress(chainId, contractAddress),
    method: "function getDBAddress() external view returns (address)",
    params: [],
  });

  const customers = await readContract({
    contract: getContractByChainAndAddress(chainId, DBAddress),
    method:
      "function getUsers() external view returns ((address,uint256)[] memory)",
    params: [],
  });
  return customers;
};

const getFee = async (
  chainId: AppChainId,
  contractAddress: string,
  proof: string[],
  walletAddress: string
) => {
  const fee = await readContract({
    contract: getContractByChainAndAddress(chainId, contractAddress),
    method:
      "function getFee(bytes32[] memory _proof, (address,uint256) memory _user) external view returns (uint)",
    params: [proof as Hex[], [walletAddress, BigInt(chainId)]],
  });
  return fee;
};

export const getFormattedSendingFee = async (
  chainId: AppChainId,
  contractAddress: string,
  proof: string[],
  walletAddress: string
): Promise<IToken> => {
  const rawFee = await getFee(
    chainId,
    `${contractAddress}`,
    proof,
    walletAddress
  );

  const LINKToken = LINKTokenContracts.find((_) => _.chainId === chainId);
  if (!LINKToken)
    return {
      rawAmount: BigInt(0),
      formattedAmount: 0,
      tokenDecimals: 0,
      tokenAddress: "",
      chainId,
    };

  const LINKdecimals = await decimals({
    contract: getContractByChainAndAddress(chainId, LINKToken.address),
  });
  const formatTokens = toTokens(rawFee, LINKdecimals);

  return {
    rawAmount: rawFee,
    formattedAmount: formatNumber(+formatTokens, 5),
    tokenDecimals: LINKdecimals,
    tokenAddress: LINKToken.address,
    chainId,
  };
};
