"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCheckWalletAndChainConnection } from "@/components/hooks";
import { z } from "zod";
import { getClientSideContractByChainAndAddress } from "@/contracts/client";
import { prepareContractCall } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import Link from "next/link";
import { shortenHex } from "thirdweb/utils";

const schema = z.object({
  title: z.string(),
  description: z.string(),
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
  const { chainName } = useParams();

  const { isWalletConnectedToCorrectChain, targetAppNetwork } =
    useCheckWalletAndChainConnection(`${chainName}`);

  const { mutateAsync, data, isPending, isSuccess, error } =
    useSendAndConfirmTransaction();

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({ mode: "all", resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    const tx = prepareContractCall({
      contract: getClientSideContractByChainAndAddress(
        targetAppNetwork.chain,
        factoryAddress
      ),
      method:
        "function createNewCrowdFunding(string calldata _title, string calldata _description, uint _minAmountInUsd, address _priceFeedAddress, int _priceFeedDecimals) external",
      params: [
        data.title,
        data.description,
        BigInt(3),
        "0x61Ec26aA57019C486B10502285c5A3D4A4750AD7",
        BigInt(8),
      ],
    });
    await mutateAsync(tx);
  };

  return (
    <div>
      <div className="mb-2">CreateNewCrowdFundingForm</div>
      {isWalletConnectedToCorrectChain ? (
        <div>
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
                  href={`${targetAppNetwork.scan}/${data.transactionHash}`}
                  target="_blank"
                  className="text-blue-700 text-sm underline"
                >
                  Transaction Hash: {shortenHex(data.transactionHash)}
                </Link>
              </div>
            )}
            {error && <div>{JSON.stringify(error)}</div>}
          </div>
        </div>
      ) : (
        <div>
          <div>
            Please connect your wallet and change to{" "}
            <span className="font-bold">{targetAppNetwork.chain.name}</span> to
            perform this operation
          </div>
        </div>
      )}
    </div>
  );
};
