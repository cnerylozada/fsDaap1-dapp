"use client";
import { storageContractClientSideOpSepolia } from "@/contracts/client";
import { useReadContract } from "thirdweb/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { studentLevels } from "./AddNewStudentForm";

const schema = z.object({
  index: z.number({ invalid_type_error: "Only integers" }).int(),
});
type SchemaType = z.infer<typeof schema>;

export const GetStudent = () => {
  const [submittedIndex, setSubmittedIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SchemaType>({
    mode: "all",
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    setSubmittedIndex(data.index);
    await refetch();
  };

  const { data, isLoading, error, refetch } = useReadContract({
    contract: storageContractClientSideOpSepolia,
    method:
      "function getStudentByIndex(uint _index) external view returns (string memory, uint8)",
    params: [BigInt(isNaN(getValues("index")) ? 0 : getValues("index"))],
    queryOptions: {
      enabled: !!submittedIndex,
    },
  });

  return (
    <div>
      <div className="font-bold">GetStudent by index</div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex space-x-2 items-center">
            <div>
              <div>
                <input
                  {...register("index", { valueAsNumber: true })}
                  placeholder="99"
                  className="border"
                />
              </div>
              {!!errors.index && (
                <div className="mt-1 text-sm text-red-700">
                  {errors.index.message}
                </div>
              )}
            </div>
            <div>
              <button
                className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200"
                type="submit"
                disabled={isLoading}
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
      <div>
        {isLoading && (
          <div className="text-sm">Searching student by index ...</div>
        )}
        {!isLoading && !error && data && (
          <div>
            Name: {data[0]} Level:{" "}
            {studentLevels.filter((_) => _.value === data[1])[0].label}
          </div>
        )}
        {error && (
          <div className="text-sm">
            There is no results for student-index: {getValues("index")}
          </div>
        )}
      </div>
    </div>
  );
};
