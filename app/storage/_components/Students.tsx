import { AddNewStudentForm } from "./AddNewStudentForm";
import { GetStudent } from "./GetStudent";

export const Students = () => {
  return (
    <div>
      <GetStudent />
      <AddNewStudentForm />
    </div>
  );
};
