"use server";
import { AppChainId } from "@/contracts/settings";

const NEBULA_API = `https://nebula-api.thirdweb.com`;

const commonFetch = (path: "session" | "chat", parseBody: string) => {
  return fetch(`${NEBULA_API}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": `${process.env.THIRDWEB_SECRET_KEY}`,
    },
    body: parseBody,
  });
};

export const createSession = async () => {
  const response = await commonFetch(
    "session",
    JSON.stringify({ title: "Smart Contract Explorer" })
  );
  const session = await response.json();
  return session.result.id;
};

export const queryContract = async (
  sessionId: string,
  contractAddress: string,
  chainId: AppChainId,
  walletAddres: string
) => {
  const message = `
    Give me the deatils of this contract and provide a structured list of all functions available in the smart contract deployed at address ${contractAddress} on chain ${chainId}.
        ### Contract Details:
    - **Name:** <contractName>
    - **Address:** <contractAddress>
    - **Chain ID:** <chainId>
    - **Blockchain:** <blockchainName>

    ### Read-only Functions:
    1. **\`<functionName(parameters)\`**
       - **Returns:** <returnType> (e.g., uint256, string, bool, etc.)
       - **Description:** <brief description of what the function does>

    ### Write-able Functions:
    1. **\`<functionName(parameters)\`**
       - **Returns:** <returnType> (if applicable)
       - **Description:** <brief description of what the function does>
       - **Payable:** <true/false> (if the function can accept Ether).
       - **Parameters:** <parameterName> <parameterType> <parameterDescription>

    If no functions exist in a category, include the section with "None available." Ensure the response is accurate, concise, and excludes unrelated details. If the contract implements interfaces (e.g., ERC20, ERC721), include their functions as well.
    `.trim();

  const body = {
    message,
    stream: false,
    session_id: sessionId,
    context: {
      chainIds: [chainId.toString()],
      wallet_address: walletAddres,
    },
  };
  const response = await commonFetch("chat", JSON.stringify(body));
  return response.json();
};

export const getAnswerByUserQuestion = async (
  sessionId: string,
  message: string,
  chainId: AppChainId,
  walletAddres: string
) => {
  const body = {
    message,
    stream: false,
    session_id: sessionId,
    context: {
      chainIds: [chainId.toString()],
      wallet_address: walletAddres,
    },
  };
  const response = await commonFetch("chat", JSON.stringify(body));
  return response.json();
};
