"use server";
import { getContractByChainAndAddress } from "@/contracts/server";
import { chainlinkVRFCoordinatorContracts } from "@/contracts/contracts";
import { AppChainId } from "@/contracts/settings";
import { getContractEvents, prepareEvent, readContract } from "thirdweb";

export const getActiveSubscriptionsByChainAndWallet = async (
  currentChain: AppChainId,
  walletAddress: string
) => {
  const VRFContract = chainlinkVRFCoordinatorContracts.filter(
    (_) => _.chainId === currentChain
  )[0];

  const subscriptionCreatedEvent = prepareEvent({
    signature:
      "event SubscriptionCreated(uint256 indexed subId, address owner)",
  });
  const subscriptionCanceledEvent = prepareEvent({
    signature:
      "event SubscriptionCanceled(uint256 indexed subId, address to, uint256 amountLink, uint256 amountNative)",
  });

  const subscriptionsCreated = await getContractEvents({
    contract: getContractByChainAndAddress(
      VRFContract.chainId,
      VRFContract.address
    ),
    events: [subscriptionCreatedEvent],
    fromBlock: "earliest",
    toBlock: "latest",
  });

  const subscriptionCanceled = await getContractEvents({
    contract: getContractByChainAndAddress(
      VRFContract.chainId,
      VRFContract.address
    ),
    events: [subscriptionCanceledEvent],
    fromBlock: "earliest",
    toBlock: "latest",
  });

  const subscriptionCreatedByUser = subscriptionsCreated
    .filter((_) => _.args.owner === walletAddress)
    .map((_) => _.args.subId);

  const subscriptionCanceledByUser = subscriptionCanceled
    .filter((_) => _.args.to === walletAddress)
    .map((_) => _.args.subId);

  const activeSubscriptions = subscriptionCreatedByUser.filter(
    (_) => !subscriptionCanceledByUser.some((item) => item === _)
  );
  return activeSubscriptions;
};

export const getSubscriptionDetailByChainAndId = async (
  currentChain: AppChainId,
  subId: bigint
) => {
  const VRFContract = chainlinkVRFCoordinatorContracts.filter(
    (_) => _.chainId === currentChain
  )[0];
  try {
    const subscription = await readContract({
      contract: getContractByChainAndAddress(
        VRFContract.chainId,
        VRFContract.address
      ),
      method:
        "function getSubscription(uint256 subId) public view returns (uint96 balance, uint96 nativeBalance, uint64 reqCount, address subOwner, address[] memory consumers)",
      params: [subId],
    });

    return { subscription };
  } catch (error) {
    return { error };
  }
};
