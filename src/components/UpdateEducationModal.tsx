import { useMutation } from "@apollo/client";
import React, { useContext } from "react";
import { UserContext, useUserContext } from "../lib/UserContext";
import { CreateEducation, UpdateEducation } from "../queries/EducationQueries";
import { toastError, toastSuccess } from "../script/Toast";

const UpdateEducationModal = ({ closeModal, education }: any) => {
  const [updateEducation] = useMutation(UpdateEducation);
  const UserContext = useUserContext();

  const handleUpdate = () => {
    const school = (document.getElementById("school") as HTMLInputElement)
      .value;
    const degree = (document.getElementById("degree") as HTMLInputElement)
      .value;
    const studyField = (document.getElementById("study") as HTMLInputElement)
      .value;
    const startDate = (document.getElementById("startDate") as HTMLInputElement)
      .value;
    const endDate = (document.getElementById("endDate") as HTMLInputElement)
      .value;
    const grade = parseFloat(
      (document.getElementById("grade") as HTMLInputElement).value
    );
    const activities = (
      document.getElementById("activities") as HTMLInputElement
    ).value;
    const description = (
      document.getElementById("description") as HTMLInputElement
    ).value;

    if (school === "") {
      toastError("Error: School cannot be empty");
    } else if (degree === "") {
      toastError("Error: Degree cannot be empty");
    } else if (studyField === "") {
      toastError("Error: Study field cannot be empty");
    } else if (startDate === "") {
      toastError("Error: Start date cannot be empty");
    } else if (endDate === "") {
      toastError("Error: End date cannot be empty");
    } else if (activities === "") {
      toastError("Error: Activities cannot be empty");
    } else if (description === "") {
      toastError("Error: Description cannot be empty");
    } else {
      updateEducation({
        variables: {
          id: education.ID,
          UserID: UserContext.user.id,
          School: school,
          Degree: degree,
          FieldOfStudy: studyField,
          StartDate: startDate,
          EndDate: endDate,
          Grade: grade,
          Activities: activities,
          Description: description,
        },
      })
        .then(() => {
          UserContext.refetchUser()
          closeModal(false);
          toastSuccess("Success: Education updated");
        })
        .catch((err) => {
          toastError(String(err));
        });
    }
  };
  return (
    <div className="modal-bg">
      <div className="modal relative">
        <button
          type="button"
          className="close"
          data-modal-toggle="authentication-modal"
          onClick={() => closeModal(false)}
        >
          <svg
            className="w-5 h-5"
            fill="gray"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>

        <h3>Update your education</h3>
        <label htmlFor="school">School</label>
        <input
          type="text"
          name="school"
          id="school"
          placeholder="Ex: Bina Nusantara"
          className="input-type"
          defaultValue={education.School}
        />
        <label htmlFor="degree">Degree</label>
        <input
          type="text"
          name="degree"
          id="degree"
          placeholder="Ex: Bachelor's"
          className="input-type"
          defaultValue={education.Degree}
        />
        <label htmlFor="study">Field Of Study</label>
        <input
          type="text"
          name="study"
          id="study"
          placeholder="Ex: Computer Science"
          className="input-type"
          defaultValue={education.FieldOfStudy}
        />
        <label htmlFor="startDate">Start Date</label>
        <input
          type="number"
          name="startDate"
          id="startDate"
          defaultValue={education.StartDate}
          className="input-type"

        />
        <label htmlFor="endDate">End Date</label>
        <input
          type="number"
          name="endDate"
          id="endDate"
          defaultValue={education.EndDate}
          className="input-type"
        />

        <label htmlFor="grade">Grade</label>
        <input
          type="number"
          name="grade"
          step="0.1"
          min="0"
          max="4"
          id="grade"
          defaultValue={education.Grade}
          className="input-type"

        />

        <label htmlFor="activities">Activities</label>
        <input
          type="text"
          name="activities"
          id="activities"
          placeholder="Ex: Voleyball, Basketball"
          className="input-type"
          defaultValue={education.Activities}

        />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          id="description"
          placeholder=""
          className="input-type"
          defaultValue={education.Description}
        />

        <div className="flex">
          <button
            className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg mt-1"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateEducationModal;
