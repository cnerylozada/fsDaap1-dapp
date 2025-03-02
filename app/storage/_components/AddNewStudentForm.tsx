"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const studentLevels = [
  { value: 0, label: "Beginner" },
  { value: 1, label: "Medium" },
  { value: 2, label: "Advanced" },
];

const schema = z.object({
  name: z.string().min(5),
  level: z.number().int(),
});
type SchemaType = z.infer<typeof schema>;

export const AddNewStudentForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>({
    mode: "all",
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    console.log("data", data);
  };

  return (
    <div>
      <div className="font-bold">AddNewStudentForm</div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <div>
              <input
                {...register("name")}
                className="border"
                placeholder="Name"
              />
            </div>
            <div>
              {!!errors.name && (
                <div className="mt-1 text-sm text-red-700">
                  {errors.name.message}
                </div>
              )}
            </div>
          </div>
          <div>
            <div>
              <select {...register("level", { valueAsNumber: true })}>
                {studentLevels.map((_) => (
                  <option key={_.value} value={_.value}>
                    {_.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <button
              className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200"
              type="submit"
            >
              Add new student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
