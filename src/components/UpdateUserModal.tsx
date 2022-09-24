import { useMutation } from "@apollo/client";
import React from "react";
import { useUserContext } from "../lib/UserContext";
import { UpdateUser } from "../queries/UserQueries";
import { toastError, toastSuccess } from "../script/Toast";

const UpdateUserModal = ({ closeModal }: any) => {
  const [updateUser] = useMutation(UpdateUser);
  const UserContext = useUserContext();

  const handleUpdate = () => {
    const firstName = (document.getElementById("firstName") as HTMLInputElement)
      .value;
    const lastName = (document.getElementById("lastName") as HTMLInputElement)
      .value;
    const additionalName = (
      document.getElementById("additionalName") as HTMLInputElement
    ).value;
    const about = (document.getElementById("about") as HTMLInputElement).value;
    const location = (document.getElementById("location") as HTMLInputElement)
      .value;

    if (firstName === "") {
      toastError("Error: First name cannot be empty");
    } else if (lastName === "") {
      toastError("Error: Last name cannot be empty");
    } else {
      updateUser({
        variables: {
          id: UserContext.user.id,
          firstName: firstName,
          lastName: lastName,
          additionalName: additionalName,
          about: about,
          location: location,
        },
      })
        .then(() => {
          UserContext.refetchUser();
          closeModal(false);
          toastSuccess("Success: Data updated!");
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

        <h3>Update your data</h3>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          placeholder="Ex: James"
          className="input-type"
          defaultValue={UserContext.user.firstName}
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          placeholder="Ex: Doe"
          className="input-type"
          defaultValue={UserContext.user.lastName}
        />
        <label htmlFor="additionalName">Additional Name</label>
        <input
          type="text"
          name="additionalName"
          id="additionalName"
          placeholder="Ex: Does"
          className="input-type"
          defaultValue={UserContext.user.additionalName}
        />

        <label htmlFor="about">About</label>
        <input
          type="text"
          name="about"
          id="about"
          placeholder="Ex: I like working"
          className="input-type"
          defaultValue={UserContext.user.about}
        />
        <label htmlFor="location">Location</label>
        <input
          type="text"
          name="location"
          id="location"
          placeholder="Ex: Jakarta, Indonesia"
          className="input-type"
          defaultValue={UserContext.user.location}
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

export default UpdateUserModal;
