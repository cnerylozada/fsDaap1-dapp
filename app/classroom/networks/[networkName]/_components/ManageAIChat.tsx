"use client";
import { getContractByChainAndAddress } from "@/contracts/client";
import { IAppContract } from "@/contracts/settings";
import { getSessionIdByWallet } from "@/server/classroom-factory";
import { createSession } from "@/server/nebula";
import { useState } from "react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { Account } from "thirdweb/wallets";
import { AIChat } from "./AIChat";

const assingSessionIdToWalletAddress = async (
  contract: IAppContract,
  account: Account,
  sessionId: string
) => {
  const tx = prepareContractCall({
    contract: getContractByChainAndAddress(contract.chainId, contract.address),
    method:
      "function assingSessionIdToWalletAddress(address _walletAddress, string memory _sessionId) external",
    params: [account.address, sessionId],
  });
  const receipt = await sendAndConfirmTransaction({
    transaction: tx,
    account,
  });
  return receipt;
};

export const ManageAIChat = ({
  appContract,
}: {
  appContract: IAppContract;
}) => {
  const activeAccount = useActiveAccount();
  const [isChatInitialized, setIsChatInitialized] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onManageSession = async () => {
    setIsChatInitialized(true);
    setIsLoading(true);
    let sessionId: string;
    if (activeAccount) {
      sessionId = await getSessionIdByWallet(
        appContract,
        activeAccount.address
      );
      if (!sessionId) {
        sessionId = await createSession();
        await assingSessionIdToWalletAddress(
          appContract,
          activeAccount,
          sessionId
        );
        sessionId = await getSessionIdByWallet(
          appContract,
          activeAccount.address
        );
      }
      setSessionId(sessionId);
    }
    setIsLoading(false);
  };

  return (
    <div>
      {isChatInitialized ? (
        <>
          {isLoading ? (
            <div>Loading chat ...</div>
          ) : (
            <div className="lg:w-[65%] lg:mx-auto">
              <AIChat appContract={appContract} sessionId={sessionId} />
            </div>
          )}
        </>
      ) : (
        <div className="text-center">
          <button
            className="p-2 bg-blue-100 rounded-md cursor-pointer"
            onClick={async () => {
              onManageSession();
            }}
          >
            Want to talk with an on-chain AI about this contract?
          </button>
        </div>
      )}
    </div>
  );
};
