"use server";
import { IToken } from "@/app/white-list/networks/[networkName]/[address]/cross/[destinyNetworkName]/[destinyAddress]/_components/models";
import { LINKTokenContracts } from "@/contracts/chainlink";
import { getContractByChainAndAddress } from "@/contracts/server";
import { AppChainId } from "@/contracts/settings";
import { Hex, readContract, toTokens } from "thirdweb";
import { decimals } from "thirdweb/extensions/erc20";
import { balanceOf, tokenOfOwnerByIndex } from "thirdweb/extensions/erc721";
import { formatNumber } from "thirdweb/utils";

export const getWhiteListCustomers = async (
  currentChainId: AppChainId,
  contractAddress: string
) => {
  const DBAddress = await readContract({
    contract: getContractByChainAndAddress(currentChainId, contractAddress),
    method: "function getDBAddress() external view returns (address)",
    params: [],
  });

  const customers = await readContract({
    contract: getContractByChainAndAddress(currentChainId, DBAddress),
    method:
      "function getUsers() external view returns ((address,uint256)[] memory)",
    params: [],
  });
  return customers;
};

const getFee = async (
  currentChainId: AppChainId,
  contractAddress: string,
  proof: string[],
  walletAddress: string
) => {
  const fee = await readContract({
    contract: getContractByChainAndAddress(currentChainId, contractAddress),
    method:
      "function getFee(bytes32[] memory _proof, (address,uint256) memory _user) external view returns (uint)",
    params: [proof as Hex[], [walletAddress, BigInt(currentChainId)]],
  });
  return fee;
};

export const getSendingFee = async (
  currentChainId: AppChainId,
  contractAddress: string,
  proof: string[],
  walletAddress: string
): Promise<IToken> => {
  const rawFee = await getFee(
    currentChainId,
    `${contractAddress}`,
    proof,
    walletAddress
  );

  const LINKToken = LINKTokenContracts.find(
    (_) => _.chainId === currentChainId
  );
  if (!LINKToken)
    return {
      rawAmount: BigInt(0),
      formattedAmount: 0,
      tokenAddress: "",
    };

  const LINKdecimals = await decimals({
    contract: getContractByChainAndAddress(currentChainId, LINKToken.address),
  });
  const formatTokens = toTokens(rawFee, LINKdecimals);

  return {
    rawAmount: rawFee,
    formattedAmount: formatNumber(+formatTokens, 5),
    tokenAddress: LINKToken.address,
  };
};

export const getNFTTokenList = async (
  currentChainId: AppChainId,
  contractAddress: string,
  walletAddress: string
) => {
  const contract = getContractByChainAndAddress(
    currentChainId,
    contractAddress
  );
  let tokenList: bigint[] = [];
  try {
    const balance = await balanceOf({
      owner: walletAddress,
      contract,
    });
    for (let index = 0; index < balance; index++) {
      const tokenId = await tokenOfOwnerByIndex({
        contract,
        owner: walletAddress,
        index: BigInt(index),
      });
      tokenList = [...tokenList, tokenId];
    }
    return tokenList;
  } catch (error) {
    console.error(`server function: getNFTTokenList`, error);
    return tokenList;
  }
};
