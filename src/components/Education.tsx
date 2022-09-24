import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import { useUserContext } from "../lib/UserContext";
import { DeleteEducation } from "../queries/EducationQueries";
import UpdateEducationModal from "./UpdateEducationModal";

const Education = (parameter: any) => {
  const [deleteEducation] = useMutation(DeleteEducation);
  const [updateModal, setUpdateModal] = useState(false);
  const UserContext = useUserContext()

  const deleteEdu = () => {
    console.log(parameter.education.ID);
    deleteEducation({ variables: { id: parameter.education.ID } }).then(() => {
      UserContext.refetchUser();
    });
  };

  return (
    <div className="card">
      {updateModal && (
        <UpdateEducationModal
          closeModal={setUpdateModal}
          education={parameter.education}
        ></UpdateEducationModal>
      )}
      <div className="flex relative w-full m-desc">
        <div className="w-full">
          <p className="text-black text-base">{parameter.education.School}</p>
          <p className="text-black text-sm">
            {parameter.education.Degree}, {parameter.education.FieldOfStudy}
          </p>
          <p className="text-black text-sm">
            {parameter.education.StartDate} - {parameter.education.EndDate}
          </p>
        </div>

        <div className="py-5 pr-1 close">
          {parameter.edit && (
            <div className="">
              <AiFillEdit
                onClick={() => setUpdateModal(true)}
                className="icon mr-5"
              ></AiFillEdit>
              <BiTrash onClick={deleteEdu} className="icon"></BiTrash>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Education;
