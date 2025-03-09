"use client";
import { useCheckWalletAndChainConnection } from "@/components/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = (minAmountInUSD: number) =>
  z.object({
    funds: z
      .number({ invalid_type_error: "Enter a valid amount" })
      .min(minAmountInUSD),
  });
type SchemaType = z.infer<ReturnType<typeof schema>>;

export const AddFundsForm = ({
  minAmountInUSD,
}: {
  minAmountInUSD: bigint;
}) => {
  const { chainName } = useParams();
  const { isWalletConnectedToCorrectChain, targetAppNetwork } =
    useCheckWalletAndChainConnection(`${chainName}`);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>({
    mode: "all",
    resolver: zodResolver(schema(+minAmountInUSD.toString())),
  });

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    console.log(`data`, data);
  };

  return (
    <div>
      <div className="font-bold">AddFundsForm</div>

      {isWalletConnectedToCorrectChain ? (
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <div>
                <input
                  {...register("funds", { valueAsNumber: true })}
                  className="border"
                  placeholder="$3"
                />
              </div>
              <div>
                {!!errors.funds && (
                  <div className="mt-1 text-sm text-red-700">
                    {errors.funds.message}
                  </div>
                )}
              </div>
            </div>
            <div>
              <button
                className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200"
                type="submit"
              >
                Add funds
              </button>
            </div>
          </form>
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
