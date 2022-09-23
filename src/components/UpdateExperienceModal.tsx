import { useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { UserContext, useUserContext } from "../lib/UserContext";
import {
  CreateExperience,
  UpdateExperience,
} from "../queries/ExperienceQueries";
import { toastError, toastSuccess } from "../script/Toast";

const UpdateExperienceModal = ({ closeModal, experience }: any) => {
  const [updateExperience] = useMutation(UpdateExperience);
  const [activeJob, setActiveJob] = useState(false);
  const UserContext = useUserContext()

  const handleCreate = () => {
    const title = (document.getElementById("title") as HTMLInputElement).value;
    const employmentType = (
      document.getElementById("employmentType") as HTMLInputElement
    ).value;
    const companyName = (
      document.getElementById("companyName") as HTMLInputElement
    ).value;
    const location = (document.getElementById("location") as HTMLInputElement)
      .value;
    const active = (document.getElementById("active") as HTMLInputElement)
      .checked;
    const startYear = (document.getElementById("startYear") as HTMLInputElement)
      .value;
    const endYear = (document.getElementById("endYear") as HTMLInputElement)
      .value;
    const industry = (document.getElementById("industry") as HTMLInputElement)
      .value;
    const description = (
      document.getElementById("description") as HTMLInputElement
    ).value;

    if (title === "") {
      toastError("Error: Title cannot be empty");
    } else if (employmentType === "") {
      toastError("Error: Employment type cannot be empty");
    } else if (companyName === "") {
      toastError("Error: Company name cannot be empty");
    } else if (location === "") {
      toastError("Error: Location cannot be empty");
    } else if (startYear === "") {
      toastError("Error: Start year cannot be empty");
    } else if (endYear === "") {
      toastError("Error: End year cannot be empty");
    } else if (industry === "") {
      toastError("Error: Industry cannot be empty");
    } else if (description === "") {
      toastError("Error: Description cannot be empty");
    } else {
      updateExperience({
        variables: {
          UserID: UserContext.user.id,
          Title: title,
          EmploymentType: employmentType,
          CompanyName: companyName,
          Location: location,
          Active: active,
          StartYear: startYear,
          EndYear: endYear,
          Industry: industry,
          Description: description,
        },
      })
        .then(() => {
          UserContext.refetchUser();
          closeModal(false);
          toastSuccess("Success: Experience updated");
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

        <h3>Add your Experience</h3>

        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Ex: Software Engineer"
          className="input-type"
          defaultValue={experience.Title}
        />

        <label htmlFor="employmentType">Employment</label>
        <select
          className="text-input white-bg"
          id="employmentType"
          name="employmentType"
          defaultValue={experience.EmploymentType}
        >
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Freelance">Freelance</option>
          <option value="Apprenticeship">Apprenticeship</option>
          <option value="Contract">Contract</option>
        </select>

        <label htmlFor="companyName">Company Name</label>
        <input
          type="text"
          name="companyName"
          id="companyName"
          placeholder="Ex: Binus"
          className="input-type"
        />

        <label htmlFor="location">Location</label>
        <input
          type="text"
          name="location"
          id="location"
          placeholder="Ex: Jakarta Indonesia"
          className="input-type"
        />

        <div className="flex input-check">
          <input
            onClick={() => {
              setActiveJob(
                (document.getElementById("active") as HTMLInputElement).checked
              );
            }}
            id="active"
            name="active"
            type="checkbox"
          />
          <label htmlFor="active">This is my current active job</label>
        </div>

        <label htmlFor="startYear">Start Year</label>
        <input
          type="number"
          name="startYear"
          id="startYear"
          defaultValue={2020}
          className="input-type"
        />

        {activeJob === true && (
          <div>
            <label htmlFor="endYear" className="text-black text-s">
              End Year
            </label>
            <input
              disabled={activeJob}
              type="text"
              id="endYear"
              name="endYear"
              defaultValue="Present"
              className="input-type"
            />
          </div>
        )}
        {activeJob !== true && (
          <div>
            <label htmlFor="endYear">End Year</label>
            <input
              type="number"
              id="endYear"
              name="endYear"
              defaultValue={2022}
              className="input-type"
            />
          </div>
        )}

        <label htmlFor="industry">Industry</label>
        <input
          type="text"
          name="industry"
          id="industry"
          placeholder="Ex: Retail"
          className="input-type"
        />

        <label htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          id="description"
          placeholder=""
          className="input-type"
        />

        <div className="flex">
          <button
            className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg mt-1"
            onClick={handleCreate}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateExperienceModal;
