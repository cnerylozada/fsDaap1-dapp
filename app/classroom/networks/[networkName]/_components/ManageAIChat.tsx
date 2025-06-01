"use client";
import { getContractByChainAndAddress } from "@/contracts/client";
import { IAppContract } from "@/contracts/settings";
import { getSessionIdByWallet } from "@/server/classroom-factory";
import { createSession } from "@/server/nebula";
import { useState } from "react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { AIChat } from "./AIChat";
import { useCheckWalletAndNetwork } from "@/components/hooks";
import { useParams } from "next/navigation";
import { Account } from "thirdweb/wallets";

const assingSessionIdToWalletAddress = async (
  contract: IAppContract,
  activeAccount: Account,
  sessionId: string
) => {
  const tx = prepareContractCall({
    contract: getContractByChainAndAddress(contract.chainId, contract.address),
    method:
      "function assingSessionIdToWalletAddress(address _walletAddress, string memory _sessionId) external",
    params: [activeAccount.address, sessionId],
  });
  try {
    await sendAndConfirmTransaction({
      transaction: tx,
      account: activeAccount,
    });
  } catch (error) {
    console.error(`client function assingSessionIdToWalletAddress`, error);
    return { errorMessage: (error as any)?.message };
  }
};

export const ManageAIChat = ({
  appContract,
}: {
  appContract: IAppContract;
}) => {
  const { networkName } = useParams();

  const [isChatInitialized, setIsChatInitialized] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    isWalletConnectedToCorrectChain,
    targetAppNetwork,
    walletAddress,
    activeAccount,
  } = useCheckWalletAndNetwork(`${networkName}`);

  const onManageSession = async (acccount: Account) => {
    setIsChatInitialized(true);
    setIsLoading(true);
    setErrorMessage("");

    let sessionId = await getSessionIdByWallet(appContract, acccount.address);
    setSessionId(sessionId);

    if (!sessionId) {
      sessionId = await createSession();
      const response = await assingSessionIdToWalletAddress(
        appContract,
        acccount,
        sessionId
      );
      if (response?.errorMessage) {
        sessionId = "";
        setIsChatInitialized(false);
        setErrorMessage(response?.errorMessage);
      }
      setSessionId(sessionId);
    }
    setIsLoading(false);
  };

  if (!activeAccount || !walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  return (
    <div>
      {isChatInitialized ? (
        <>
          {isLoading && !sessionId ? (
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
              onManageSession(activeAccount);
            }}
          >
            Want to talk with an on-chain AI about this contract?
          </button>
        </div>
      )}
      {errorMessage && (
        <div className="mt-1 text-sm text-red-700">{errorMessage}</div>
      )}
    </div>
  );
};
