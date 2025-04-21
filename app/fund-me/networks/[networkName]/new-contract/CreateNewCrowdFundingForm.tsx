"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCheckWalletAndNetwork } from "@/components/hooks";
import { z } from "zod";
import { prepareContractCall } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import Link from "next/link";
import { shortenHex } from "thirdweb/utils";
import { getContractByChainAndAddress } from "@/contracts/client";
import { AppChainId, appScanURLRecord } from "@/contracts/settings";

const priceFeedAddresses = [
  {
    address: "0x61Ec26aA57019C486B10502285c5A3D4A4750AD7",
    decimals: 8,
    chainId: AppChainId.optimismSepolia,
  },
  {
    address: "0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165",
    decimals: 8,
    chainId: AppChainId.arbitrumSepolia,
  },
];

const schema = z.object({
  title: z.string().min(5).max(30),
  description: z.string().min(5).max(50),
  minAmountInUsd: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive(),
});
type SchemaType = z.infer<typeof schema>;

export const CreateNewCrowdFundingForm = ({
  factoryAddress,
}: {
  factoryAddress: string;
}) => {
  const { networkName } = useParams();

  const {
    isWalletConnectedToCorrectChain,
    appChainId,
    walletAddress,
    targetAppNetwork,
  } = useCheckWalletAndNetwork(`${networkName}`);

  const { mutate, data, isPending, isSuccess, error, isError } =
    useSendAndConfirmTransaction();

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({ mode: "all", resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    const dataFeed = priceFeedAddresses.find((_) => _.chainId === appChainId);
    if (dataFeed) {
      const tx = prepareContractCall({
        contract: getContractByChainAndAddress(appChainId, factoryAddress),
        method:
          "function createNewCrowdFunding(string calldata _title, string calldata _description, uint _minAmountInUsd, address _priceFeedAddress, int _priceFeedDecimals) external",
        params: [
          data.title,
          data.description,
          BigInt(data.minAmountInUsd),
          dataFeed.address,
          BigInt(dataFeed.decimals),
        ],
      });
      mutate(tx);
    }
  };

  if (!walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  return (
    <div>
      <div className="mb-2">CreateNewCrowdFundingForm</div>
      <div className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-3">
            <div>
              <div>
                <input
                  {...register("title")}
                  className="border"
                  placeholder="Name"
                />
              </div>
              <div>
                {!!errors.title && (
                  <div className="mt-1 text-sm text-red-700">
                    {errors.title.message}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div>
                <input
                  {...register("description")}
                  className="border"
                  placeholder="Description"
                />
              </div>
              <div>
                {!!errors.description && (
                  <div className="mt-1 text-sm text-red-700">
                    {errors.description.message}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div>
                <input
                  {...register("minAmountInUsd", { valueAsNumber: true })}
                  className="border"
                  placeholder="$USD 5"
                />
              </div>
              <div>
                {!!errors.minAmountInUsd && (
                  <div className="mt-1 text-sm text-red-700">
                    {errors.minAmountInUsd.message}
                  </div>
                )}
              </div>
            </div>
            <div>
              <button
                className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200"
                type="submit"
                disabled={isPending}
              >
                Create
              </button>
            </div>
          </div>
        </form>
        <div>
          {isPending && <div>Loading transaction ...</div>}
          {isSuccess && (
            <div>
              Check your transaction:{" "}
              <Link
                href={`${appScanURLRecord[appChainId]}/${data.transactionHash}`}
                target="_blank"
                className="text-blue-700 text-sm underline"
              >
                Transaction Hash: {shortenHex(data.transactionHash)}
              </Link>
            </div>
          )}
          {isError && <div>{error.message}</div>}
        </div>
      </div>
    </div>
  );
};
