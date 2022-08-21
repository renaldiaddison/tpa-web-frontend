import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { Register } from "../queries/userQueries";
import { toastError, toastSuccess } from "../script/Toast";

const RegisterPage = () => {
  const [registerAccount] = useMutation(Register);
  const [Error, setError] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: any) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const firstName = (document.getElementById("firstName") as HTMLInputElement)
      .value;
    const lastName = (document.getElementById("lastName") as HTMLInputElement)
      .value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email === "") {
      toastError("Error: Email cannot be empty");
    } else if (!email.match(mailFormat)) {
      toastError("Error: Please enter a valid email");
    } else if (firstName === "") {
      toastError("Error: First name cannot be empty");
    } else if (lastName === "") {
      toastError("Error: Last name cannot be empty");
    } else if (password === "") {
      toastError("Error: Password cannot be empty");
    } else {
      registerAccount({
        variables: {
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: password,
        },
      })
        .then(() => {
          toastSuccess(
            "Success: Account activation link sent, please check your email!"
          );
          navigate("/");
        })
        .catch((err) => {
          toastError(String(err));
        });
    }
  };

  return (
    <div className="h-screen">
      <Logo />
      <div className="h-full flex justify-center items-center">
        <div className="w-full max-w-sm border-2 items-center shadow-md rounded-lg">
          <div className="pb-1 border-b-2">
            <p className="px-8 text-2xl font-bold justify-between items-center">
              Register
            </p>
            <p className="px-8 text-sm justify-between items-center mt-minus-1">
              Make the most of your professional life
            </p>
          </div>
          <form
            onSubmit={handleRegister}
            className="bg-white rounded-lg px-8 pt-6 mb-4"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border box-border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus-outline-none"
                name="email"
                id="email"
                type="email"
                placeholder="Email"
              ></input>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                className="shadow appearance-none border box-border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus-outline-none"
                name="firstName"
                id="firstName"
                type="text"
                placeholder="First Name"
              ></input>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                className="shadow appearance-none border box-border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus-outline-none"
                name="lastName"
                id="lastName"
                type="text"
                placeholder="Last Name"
              ></input>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border box-border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus-outline-none"
                name="password"
                id="password"
                type="password"
                placeholder="Password"
              ></input>
            </div>
            <div className="text-center text-xs my-1">
              By clicking Agree & Join, you agree to the LinkedIn{" "}
              <a href="https://www.linkedin.com/legal/user-agreement?trk=registration-frontend_join-form-user-agreement">
                User Agreement
              </a>
              ,{" "}
              <a href="https://www.linkedin.com/legal/privacy-policy?trk=registration-frontend_join-form-privacy-policy">
                Privacy Policy
              </a>
              , and{" "}
              <a href="https://www.linkedin.com/legal/cookie-policy?trk=registration-frontend_join-form-cookie-policy">
                Cookie Policy
              </a>
              .
            </div>

            <div className="items-center justify-between pt-2">
              <button
                className="w-full cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold py-2 px-4 rounded-lg"
                type="submit"
              >
                Agree & Join
              </button>
              <div className="flex text-sm justify-center pt-3">
                <p className="mr-1">Already on LinkhedIn?</p>
                <p className="align-baseline">
                  <Link to="/">Login here</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
