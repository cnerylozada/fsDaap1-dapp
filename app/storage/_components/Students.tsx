import { GetStudent } from "./GetStudent";
import { AddNewStudentForm } from "./AddNewStudentForm";

export const Students = () => {
  return (
    <div className="space-y-4">
      <GetStudent />
      <AddNewStudentForm />
    </div>
  );
};
