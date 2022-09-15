import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import { DeleteExperience } from "../queries/ExperienceQueries";
import UpdateExperienceModal from "./UpdateExperienceModal";

const Experience = (parameter: any) => {
  const [deleteExperience] = useMutation(DeleteExperience);
  const [updateModal, setUpdateModal] = useState(false);
  const deleteExp = () => {
    deleteExperience({ variables: { id: parameter.experience.ID } }).then(
      () => {
        parameter.refetch();
      }
    );
  };

  return (
    <div className="card">
      {updateModal && (
        <UpdateExperienceModal
          closeModal={setUpdateModal}
          refetch={parameter.refetch}
          experience={parameter.experience}
        ></UpdateExperienceModal>
      )}
      <div className="flex relative w-full m-desc">
        <div className="w-full">
          <p className="text-black text-base">{parameter.experience.Title}</p>
          <p className="text-black text-sm">
            {parameter.experience.CompanyName} [
            {parameter.experience.EmploymentType}]
          </p>
          <p className="text-black text-sm">
            {parameter.experience.StartYear} - {parameter.experience.EndYear}
          </p>
          <p className="text-black text-sm">{parameter.experience.Location}</p>
        </div>
        <div className="py-5 pr-1 close">
          {parameter.edit && (
            <div>
              <AiFillEdit
                onClick={() => setUpdateModal(true)}
                className="icon mr-5"
              ></AiFillEdit>
              <BiTrash onClick={deleteExp} className="icon"></BiTrash>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Experience;
