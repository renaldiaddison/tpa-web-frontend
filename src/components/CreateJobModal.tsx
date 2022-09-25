import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useUserContext } from "../lib/UserContext";
import { AddJobs } from "../queries/JobQueries";
import { toastError, toastSuccess } from "../script/Toast";

const CreateJobModal = ({ closeModal, refetchJob }: any) => {
  const [createJob] = useMutation(AddJobs);
  const UserContext = useUserContext();
  const [activeJob, setActiveJob] = useState(false);

  const handleCreate = () => {
    const title = (document.getElementById("title") as HTMLInputElement).value;
    const companyName = (
      document.getElementById("companyName") as HTMLInputElement
    ).value;
    const workplace = (document.getElementById("workplace") as HTMLInputElement)
      .value;
    const city = (document.getElementById("city") as HTMLInputElement).value;
    const country = (document.getElementById("country") as HTMLInputElement)
      .value;
    const employmentType = (
      document.getElementById("employmentType") as HTMLInputElement
    ).value;
    const description = (
      document.getElementById("description") as HTMLInputElement
    ).value;

    if (title === "") {
      toastError("Error: Title cannot be empty");
    } else if (companyName === "") {
      toastError("Error: Company name cannot be empty");
    } else if (workplace === "") {
      toastError("Error: Workplace cannot be empty");
    } else if (city === "") {
      toastError("Error: City cannot be empty");
    } else if (country === "") {
      toastError("Error: Country cannot be empty");
    } else if (employmentType === "") {
      toastError("Error: Employment type cannot be empty");
    } else if (description === "") {
      toastError("Error: Description cannot be empty");
    } else {
      createJob({
        variables: {
          title: title,
          companyName: companyName,
          workplace: workplace,
          city: city,
          country: country,
          employmentType: employmentType,
          description: description,
        },
      })
        .then(() => {
          refetchJob();
          closeModal(false);
          toastSuccess("Success: Job created");
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

        <h3>Add New Job</h3>

        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Ex: Software Engineer"
          className="input-type"
        />

        <label htmlFor="companyName">Company Name</label>
        <input
          type="text"
          name="companyName"
          id="companyName"
          placeholder="Ex: Binus"
          className="input-type"
        />

        <label htmlFor="workplace">Workplace</label>
        <input
          type="text"
          name="workplace"
          id="workplace"
          placeholder="Ex: WFH"
          className="input-type"
        />

        <label htmlFor="city">City</label>
        <input
          type="text"
          name="city"
          id="city"
          placeholder="Ex: Jakarta"
          className="input-type"
        />

        <label htmlFor="country">Country</label>
        <input
          type="text"
          name="country"
          id="country"
          placeholder="Ex: Indonesia"
          className="input-type"
        />

        <label htmlFor="employmentType">Employment Type</label>
        <select
          className="text-input white-bg"
          id="employmentType"
          name="employmentType"
        >
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Freelance">Freelance</option>
          <option value="Apprenticeship">Apprenticeship</option>
          <option value="Contract">Contract</option>
        </select>

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
export default CreateJobModal;
