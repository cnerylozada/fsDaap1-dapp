import { getAppChainIdByPath } from "@/components/utils/contracts";
import { getContractByChainAndAddress } from "@/contracts/client";
import { appScanURLRecord } from "@/contracts/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { prepareContractCall, toWei } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { shortenHex } from "thirdweb/utils";
import { z } from "zod";

const schema = (priceFeed: number, minAmountInUSD: number) =>
  z.object({
    funds: z
      .number({ invalid_type_error: "Enter a valid amount" })
      .positive()
      .refine((_) => _ * priceFeed >= minAmountInUSD, {
        message: `Your ETH amount to USD must be at least USD$${minAmountInUSD.toString()}`,
      }),
  });
type SchemaType = z.infer<ReturnType<typeof schema>>;

export const AddFundsForm = ({
  minAmountInUSD,
  priceFeed,
}: {
  minAmountInUSD: number;
  priceFeed: number;
}) => {
  const { address, networkName } = useParams();
  const appChainId = getAppChainIdByPath(`${networkName}`);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>({
    mode: "all",
    resolver: zodResolver(schema(priceFeed, minAmountInUSD)),
  });

  const { mutateAsync, data, isPending, isSuccess, error } =
    useSendAndConfirmTransaction();

  const router = useRouter();

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    const tx = prepareContractCall({
      contract: getContractByChainAndAddress(appChainId, `${address}`),
      method: "function fund() external payable",
      params: [],
      value: toWei(data.funds.toString()),
    });
    await mutateAsync(tx);
    router.refresh();
  };

  return (
    <div>
      <div className="font-bold">AddFundsForm</div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <div>
              <input
                {...register("funds", { valueAsNumber: true })}
                className="border"
                placeholder="0.5 ETH"
              />
            </div>
            {!!errors.funds && (
              <div className="mt-1 text-sm text-red-700">
                {errors.funds.message}
              </div>
            )}
          </div>
          <div>
            <button
              className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer disabled:cursor-not-allowed"
              type="submit"
              disabled={isPending}
            >
              Add funds
            </button>
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
          {error && (
            <div className="mt-1 text-red-700 text-sm">{error.message}</div>
          )}
        </div>
      </div>
    </div>
  );
};
